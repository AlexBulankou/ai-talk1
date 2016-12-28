namespace tr24ai.Controllers
{
    using System.Configuration;
    using System.IO;
    using System.Net;
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

        public FileContentResult Header()
        {
            var result = new MemoryStream();
            HttpWebRequest httpClient = (HttpWebRequest)HttpWebRequest.Create(ConfigurationManager.AppSettings["HeaderUrl"]);
            using (var responseStream = httpClient.GetResponse().GetResponseStream())
            {
                responseStream.CopyTo(result);
            }

            return new FileContentResult(result.ToArray(), "image/png");

        }

        public ContentResult Stock(string symbol)
        {
            var result = string.Empty;
            HttpWebRequest httpClient = (HttpWebRequest)HttpWebRequest.Create((ConfigurationManager.AppSettings["NodeServerUrl"] + "/?stock=" + symbol));
            using (StreamReader reader = new StreamReader(httpClient.GetResponse().GetResponseStream()))
            {
                result = reader.ReadToEnd();
            }

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