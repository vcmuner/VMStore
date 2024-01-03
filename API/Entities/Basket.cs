using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
	public class Basket
	{
		public int Id { get; set; }
		public string BuyerId { get; set; }

		//Each basket has many items (one to many relationship). EF figures this relationships out
		public List<BasketItem> Items { get; set; } = new List<BasketItem>(); //We initialize the List so it is never null. We could also use 'new ()'

		//METHODS

		//If we have the item in the basket we increase quantity, if not, we add it as a new item
		public void AddItem(Product product, int quantity)
		{
			//We now items is not gonna be null because it was already initialized above. It is gonna be empty or have items
			if (Items.All(item => item.ProductId != product.Id))
			{
				Items.Add(new BasketItem { Product = product, Quantity = quantity });
			}
			var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
			if (existingItem != null) existingItem.Quantity += quantity;
		}

		public void RemoveItem(int productId, int quantity)
		{
			//Cheking if the list of items in the basket contains the productId we pass as a parameter
			var item = Items.FirstOrDefault(item => item.ProductId == productId);
			if (item == null) return;
			item.Quantity -= quantity;
			//If the quantity is 0, we remove the item from the basket
			if (item.Quantity <= 0) Items.Remove(item);
		}
	}
}