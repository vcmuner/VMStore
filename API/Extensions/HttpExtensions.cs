using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
	public static class HttpExtensions
	{
		public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
		{
			var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
			//"Append" will throw an exception if trying to add duplicate header, "Add" will not
			response.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
			response.Headers.Append("Access-Control-Expose-Headers", "Pagination"); //This makes the Pagination header available in the client (which has a different domain, so we need to make our custom header available there)
		}
	}
}