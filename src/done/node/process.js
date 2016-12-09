var http = require('http');
var url = require('url');

var appInsights = require("applicationinsights");
appInsights.setup("2f43896d-f3ae-4c72-8c4f-fcec8b06c657").start();

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var stock = query["stock"];
    if (stock) {
        stock = stock.toLowerCase();
        var path = "/finance/info?client=ig&q=";
        if (Math.random() > 0.7) {
            path = "/finance/info?client=ig&c=";
        }

        http.get({ host: "finance.google.com", path: path + stock }, function (response) {
            if (response.statusCode === 400) {
                res.statusCode = 204;
                res.end();
            }

            var stockData = "";
            response.on('data', function (d) {
                stockData += d;
            });
            response.on("end", function () {
                res.end(stockData);
            });
            response.on("error", function () {
                res.statusCode = 204;
                res.end();
            });
        });
    } else {
        res.end();
    }

}).listen(process.env.PORT || 24011);  