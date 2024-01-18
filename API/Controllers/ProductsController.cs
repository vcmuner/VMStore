using System.Text.Json;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class ProductsController : BaseApiController
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
		public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
		//[FromQuery] tells the GET method to look for params in the query string instead of looking for an object in the request body (we are passing an object to the function)
		{
			var query = _context.Products
			.Sort(productParams.OrderBy) //With Extension methods (in this case, the ones in ProductExtensions file) we can call out custom Sort using query.Sort(param)
			.Search(productParams.SearchTerm)
			.Filter(productParams.Types)
			.AsQueryable(); //Still not executing anything against the database

			//return await query.ToListAsync(); //Executes the query against the database
			var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

			//We return the product params as headers serializing as a json our metadata
			Response.AddPaginationHeader(products.MetaData);

			return products;
		}

		//Returns an individual product
		[HttpGet("{id}")] //api/products/{id}
		public async Task<ActionResult<Product>> GetProduct(int id)
		{
			var product = await _context.Products.FindAsync(id);
			if (product == null) return NotFound();
			return product;
		}

		[HttpGet("filters")]
		public async Task<ActionResult<Product>> GetFilters(int id)
		{
			var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
			return Ok(new { types });
		}
	}
}