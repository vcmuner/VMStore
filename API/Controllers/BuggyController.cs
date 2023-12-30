using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	public class BuggyController : BaseApiController
	{
		//Our API is going to see these methods as identical even though they've got different names
		//The API controller doesn't actually or is not able to tell the difference between what we call these endpoints
		//We need a unique route for each method 
		[HttpGet("not-found")]
		public ActionResult GetNotFound()
		{
			return NotFound();
		}

		[HttpGet("bad-request")]
		public ActionResult GetBadRequest()
		{
			return BadRequest(new ProblemDetails { Title = "This is a bad request" });
		}

		[HttpGet("unauthorized")]
		public ActionResult GetUnauthorized()
		{
			return Unauthorized();
		}

		[HttpGet("validation-error")]
		public ActionResult GetValidationError()
		{
			ModelState.AddModelError("Problem1", "This is the 1st error");
			ModelState.AddModelError("Problem2", "This is the 2nd error");
			//returns a 400 status code but also the array of errors that occurred in the model state
			return ValidationProblem();
		}

		[HttpGet("server-error")]
		public ActionResult GetServerError()
		{
			throw new Exception("This is a server error");
		}
	}
}