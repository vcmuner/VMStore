using API.Entities;

namespace API.Extensions
{
	//The idea of extension methods is to make custom methods available for, in this, case, an IQueryable of type Product
	//Anything we do against the Product entity will be inside this class
	public static class ProductExtensions
	{
		//p1: What type we are extending
		//p2: Our sorting/sarch/filter param
		public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
		{
			if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name); //If orderBy param is null or empty we return products in alphabetical order
			query = orderBy switch
			{
				"price" => query.OrderBy(p => p.Price),
				"priceDesc" => query.OrderByDescending(p => p.Price),
				_ => query.OrderBy(p => p.Name) //Default
			};
			return query;
		}

		public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
		{
			if (string.IsNullOrWhiteSpace(searchTerm)) return query; //If searchTerm param is null or empty we return all products
			var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

			return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
		}

		public static IQueryable<Product> Filter(this IQueryable<Product> query, string types)
		{
			var typeList = new List<string>();

			if (!string.IsNullOrWhiteSpace(types))
			{
				typeList.AddRange(types.ToLower().Split(",").ToList());
			}

			return query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));
		}
	}
}