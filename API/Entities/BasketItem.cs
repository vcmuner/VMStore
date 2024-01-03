using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
	//Good practice: table names in plural. We can set that up with data annotations:
	[Table("BasketItems")]
	public class BasketItem
	{
		public int Id { get; set; }
		public int Quantity { get; set; }

		//Navigation properties (to have a relation between the basket and the products inside it)
		//We are not gonna have a full product inside out BasketItem table in the DB. We are only gonna have the ProductId
		public int ProductId { get; set; }
		//Each basket item is gonna be 1 product (one to one relationship). EF figures this relationships out
		public Product Product { get; set; }

		//Basket Items must have full relationship navigation properties, so adding this below means that for a basket item to exist, there has to be a basket, it can not exist by itself
		public int BasketId { get; set; }
		public Basket Basket { get; set; }

		//Adding the ProductId, Product, BasketId and Basket will guarantee that the "onDelete: ReferentialAction.Cascade)" is generated in BasketItems table
		//Which means that, if we delete a product or a basket it will cascade and delete the associated basket items as well
		//With this, we prevent having basket items that no longer exist or orphan basket items (basket items without a basket)
	}
}