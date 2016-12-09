## Setup
- Sync sources
- Install iisnode for IIS 7.x/8.x: [x86](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x86.msi) or [x64](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x64.msi) - choose bitness matching your system
- Create website in IIS and point it to \src\start\node directory
  - Use HTTPS and port 24001
  ![img](/instructions/1.PNG)
- Create website in IIS and point it to src\start\aspnet\tr24ai\tr24ai directory
  - Use HTTPS and port 24002
- Load website: https://localhost:24002/

## Onboarding to AI
 - From src/start/node run ``npm install``
 - In Azure portal create AI resource for node app and AI resource for aspnet app
 - Insert in src/start/node/package.js immediately after other require declarations:
 ``
 var appInsights = require("applicationinsights");
 appInsights.setup("<instrumentation_key_for_node_app>").start();
``

 - Onboard src/start/aspnet project to AI .NET SDK 2.2. Ensure ``instrumentation_key_for_aspnet_app`` is used
 - Rebuild aspnet app
 - Add JS snippet to the end of the head tag for both Index.cshtml and Details.cshtml. NOTE that you need to add ``disableCorrelationHeaders: false`` to the snippet:
 ``
     <script type="text/javascript">
        var appInsights = window.appInsights || function (config) {
            function i(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, u = document, e = window, o = "script", s = "AuthenticatedUserContext", h = "start", c = "stop", l = "Track", a = l + "Event", v = l + "Page", y = u.createElement(o), r, f; y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js"; u.getElementsByTagName(o)[0].parentNode.appendChild(y); try { t.cookie = u.cookie } catch (p) { } for (t.queue = [], t.version = "1.0", r = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; r.length;) i("track" + r.pop()); return i("set" + s), i("clear" + s), i(h + a), i(c + a), i(h + v), i(c + v), i("flush"), config.disableExceptionTracking || (r = "onerror", i("_" + r), f = e[r], e[r] = function (config, i, u, e, o) { var s = f && f(config, i, u, e, o); return s !== !0 && t["_" + r](config, i, u, e, o), s }), t
        }({
            instrumentationKey: "instrumentation_key_for_aspnet_app",
            disableCorrelationHeaders: false
        });

        window.appInsights = appInsights;
        appInsights.trackPageView();
    </script>
``