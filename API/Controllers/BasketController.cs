
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class BasketController : BaseApiController
	{
		private readonly StoreContext _context;
		public BasketController(StoreContext context)
		{
			_context = context;
		}

		//When a user creates a basket on our server, we're going to return them a buyer ID
		//Which is going to be sent back to them as a cookie
		//And cookies are stored in a user's browser in storage

		[HttpGet(Name = "GetBasket")]
		public async Task<ActionResult<BasketDto>> GetBasket()
		{
			var basket = await RetrieveBasket();
			if (basket == null) return NotFound();
			return MapBasketToDto(basket);
		}

		[HttpPost] ///api/Basket?productId={productId}&quantity={quantity}
		//We will take the param values from the query string
		//Because we're using the API controller attributes in our base API controller, it's able to read the query string
		//As long as the keys match with the name of what we've called this in our parameters, then it's going to know that's where we want to get them from
		public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
		{
			//Get basket from the DB|| Create new basket (if the user does not have one)
			var basket = await RetrieveBasket();
			if (basket == null) basket = CreateBasket();
			//Get product
			var product = await _context.Products.FindAsync(productId);
			if (product == null) return NotFound();
			//Add item
			basket.AddItem(product, quantity);
			//Save changes
			var result = await _context.SaveChangesAsync() > 0; //Returns the number of saved changes in our DB. If it is NOT greater than 0, we have NOT saved anything in the DB
			if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket)); //The "GetBasket" route will add a Location header with the path and the resource created
			return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
		}

		[HttpDelete]
		public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
		{
			//Get basket
			var basket = await RetrieveBasket();
			if (basket == null) return NotFound();
			//Remove item or reduce quantity
			basket.RemoveItem(productId, quantity);
			//Save changes
			var result = await _context.SaveChangesAsync() > 0; //Returns the number of saved changes in our DB. If it is NOT greater than 0, we have NOT saved anything in the DB
			if (result) return Ok();
			return BadRequest(new ProblemDetails { Title = "Problem removing item to basket" });
		}

		private async Task<Basket> RetrieveBasket()
		{
			return await _context.Baskets
			//Make Entity framework include the items in the basket
			.Include(i => i.Items)
			//And then include the related product for each item
			.ThenInclude(p => p.Product)
			.FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
		}

		private Basket CreateBasket()
		{
			var buyerId = Guid.NewGuid().ToString();
			//IsEssential is set to true because our website will not function correctly without this cookie
			//We do NOT set the http only flag, because we need to be able to retrieve this info from the client side
			var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
			//We have access to the response because we are in a controller
			Response.Cookies.Append("buyerId", buyerId, cookieOptions);
			var basket = new Basket { BuyerId = buyerId };
			_context.Baskets.Add(basket);
			return basket;
		}

		private BasketDto MapBasketToDto(Basket basket)
		{
			return new BasketDto
			{
				Id = basket.Id,
				BuyerId = basket.BuyerId,
				//Mapping properties from the BasketItem to the BasketItemDto
				Items = basket.Items.Select(item => new BasketItemDto
				{
					ProductId = item.ProductId,
					Name = item.Product.Name,
					Price = item.Product.Price,
					PictureUrl = item.Product.PictureUrl,
					Type = item.Product.Type,
					Quantity = item.Quantity
				}).ToList()
			};
		}
	}
}