namespace tr24ai.Controllers
{
    using System.Net.Http;
    using System.Web;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Details()
        {
            return View();
        }

        public ContentResult Stock(string symbol)
        {
            HttpClient httpClient = new HttpClient();
            var responseTask = httpClient.GetAsync("https://localhost:24001/?stock=" + symbol);
            var result = responseTask.Result.Content.ReadAsStringAsync().Result;

            if (!string.IsNullOrEmpty(result))
            {
                return Content(result.Substring(4), "application/json");
            }
            else
            {
                throw new HttpException(500, "Invalid dependency response");
            }

        }
    }
}