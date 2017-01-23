var http = require('http');
var url = require('url');

var appInsights = require("applicationinsights");
appInsights.setup("346a9b7d-925f-4567-9ebe-bfdc762646ed").start();

appInsights.client.addTelemetryProcessor(function(envelope, context)  {
    if (envelope.data.baseType === "Microsoft.ApplicationInsights.RemoteDependencyData") {
        var reqOptions = context["http.RequestOptions"];
        // check if context object passed with telemetry initializer contains expected headers property
        if (reqOptions && reqOptions.headers) {
            // get the correlation id from headers
            var id = reqOptions.headers["x-ms-request-root-id"];
            if (id !== undefined) {
                // associate telemetry item with this correlaiton id
                envelope.tags["ai.operation.id"] = id;
            }
        }
    }
    return true;
});

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

// read the correlation header
var id=undefined;
if (req && req.headers){
             id = req.headers["x-ms-request-root-id"];
}

            // set the correlation header to the outgoing http request
            var headers = (id !== undefined) ? {"x-ms-request-root-id": id} : {};
            http.get({ host: "finance.google.com", path: path + stock, headers:headers }, function (response) {
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