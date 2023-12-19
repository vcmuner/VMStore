using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ProductsController : ControllerBase
	{
		//Using dependency injection to get our store context inside here so that we've got access to the products table in our database
		private readonly StoreContext _context;
		public ProductsController(StoreContext context)
		{
			_context = context;
		}
		
		//Creating endpoints
		[HttpGet]
		//Returns a list of products
		//async + Task (wrapper around ActionResult)
		public async Task<ActionResult<List<Product>>> GetProducts()
		{
			var products = await _context.Products.ToListAsync();
			return Ok(products); //returns 200 and the list of products
		}

		[HttpGet("{id}")] //api/products/{id}
		//Returns an individual product
		public async Task <ActionResult<Product>> GetProduct(int id)
		{
			//can also return directly this way
			return await _context.Products.FindAsync(id);
		}
	}
}