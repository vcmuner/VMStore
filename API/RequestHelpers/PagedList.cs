using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
	//Class to return the pagination metadata of the product or any of our entities
	public class PagedList<T> : List<T>
	{
		public PagedList(List<T> items, int count, int pageNumber, int pageSize)
		{
			MetaData = new MetaData
			{
				TotalCount = count,
				PageSize = pageSize,
				CurrentPage = pageNumber,
				//Ceiling rounds up the total pages, so if we have 9 products
				//And max items per page is 6
				//It will round up to 2 pages
				TotalPages = (int)Math.Ceiling(count / (double)pageSize)
			};
			AddRange(items);
		}
		public MetaData MetaData { get; set; }

		public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
		{
			var count = await query.CountAsync(); //Query executes against the DB to find out the total count available

			//Skip and Take operators:
			//If we have a page size of ten and 18 items in our database and we want the second page and we want this query to work as intended
			//Then page number minus one, if we're on page number two, page number minus one is of course one times by ten, which is the page size
			//That means we're going to skip ten records and take the next ten records.
			//If we had a product list of 18 items, that would give us the next eight records.
			var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
			return new PagedList<T>(items, count, pageNumber, pageSize); //Pass params in the same order as constructor
		}
	}
}