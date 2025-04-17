using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FinalExam.API.Data;
using System.Globalization;

namespace FinalExam.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FinalExamController : ControllerBase
    {

        private FinalExamDbContext _bezosContext;
        public FinalExamController(FinalExamDbContext temp) => _bezosContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageHowMany = 10, int pageNum = 1)
        {


            var something = _bezosContext.Books
                .Skip((pageNum-1) * pageHowMany)  //Why is this here?
                .Take(pageHowMany)
                .ToList();

            var totalNumBooks = _bezosContext.Books.Count();

            var someObject = new
            {
                books = something,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject); //200 level status

        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bezosContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }


 
    }
}
