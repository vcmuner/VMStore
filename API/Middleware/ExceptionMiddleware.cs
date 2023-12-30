
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
	public class ExceptionMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionMiddleware> _logger;
		private readonly IHostEnvironment _env;

		// request delegates allow us to execute that next method and pass on the request to the next piece of middleware
		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
		{
			_next = next;
			_logger = logger;
			_env = env;
		}

		//Because this is middleware, we have to provide a method called invoke async. Our framework is expecting our middleware to have this particular method
		//If we call it something different, we won't get an error, but our middleware will not function as we expect because this won't be executed
		public async Task InvokeAsync(HttpContext context)
		{
			try
			{
				await _next(context);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, ex.Message);
				//We need to specify a content type (which type of content we're going to be returning in our response) because we're not inside the context of an API controller
				//We also need to specify in our response the status code and set this to be equal to 500, which represents an internal server error
				context.Response.ContentType = "application/json";
				context.Response.StatusCode = 500;

				//We create a response of type of ProblemDetails so that it retains the same format as the rest of our errors in our application
				var response = new ProblemDetails
				{
					Status = 500,
					//We return the stack trace only in development mode (we set the stack trace as optional in case the stack trace is null to not cause exceptions in our catch block)
					Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
					Title = ex.Message
				};

				//Options for the JSON serialize
				//We're going to be returning our exception in JSON format and once again, because we're outside the context of an API controller, we lose some of the defaults
				//When our API controller returns a JSON response, then it uses camel case but outside of an API controller, we need to specify these options.
				var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
				var json = JsonSerializer.Serialize(response, options);
				await context.Response.WriteAsync(json);
			}
		}
	}
}