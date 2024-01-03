using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt =>
{
	opt.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});
builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(); //Exception handler goes on top of the pipeline

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}
//Middleware
app.UseCors(opt =>
{
	//AllowCredentials is needed so we can pass the cookie from our API server and the client (if we do not add this it will not work because server and client are on different domains)
	opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//We need to get hold of our DB context service, but we cannot inject our store context inside this class
//And one of the ways we can do that is by creating a scope and storing it inside this variable
var scope = app.Services.CreateScope();
//Store our context
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

//Applies any pending migrations for the context to the database, and it will create the database if it does not already exist
//And if our database does already exist, then simply nothing happens if there's no migrations to apply
//If we do not have a database, then it's going to create the database and apply any pending migrations
try
{
	context.Database.Migrate();
	DBInitializer.Initialize(context);
}
catch (Exception ex)
{
	logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
