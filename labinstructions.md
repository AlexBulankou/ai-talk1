#ILL Instructions

##Introduction

In the modern world microservices architecture allows to increase development agility and time to market. With the micro services simplicity and high independance you can employ "the best tool for the job". Contiunues delivery and DevOps practices makes development and releases of individual services easy and straightforward.   

Microservices architecture comes at a price of: 

1. Operations Overhead
2. Distributed System Complexity
3. End-to-end transactions resolving complexity
4. Implicit Interfaces and versioning problems

Application Insights makes it easier to monitor the microservices. In this lab we will walk you thru the typical scenarios you'll implement while managing your microservices environment.


## Excercise 1. Permissions/roles

###Create Application Inisghts resources

1. Open Azure portal at [portal.azure.com](https://portal.azure.com)
2. Press "+" sign in the left upper corner, type "Application Insights"

    ![image](/instructions/create-applicationinsights-step1.png)

3. Press on "Application Insights" and then "Create" button to create a new Application Insights component
4. In the creation form use the following properties to create Application Insights resource for the frontend application:

  1. Name: **frontend**
  2. Application Type: keep **ASP.NET web application**
  3. Resource Group -> Create new: **frontend**
  4. Location: **South Central US**
  
5. Open Application Insights creation form again (steps 2 and 3).
4. In the creation form use the following properties to create Application Insights resource for the backend application:

  1. Name: **backend**
  2. Application Type: keep **ASP.NET web application**
  3. Resource Group -> Create new: **backend**
  4. Location: **South Central US**

###Set up reader Permissions

1. In search box in the top-middle of the screen type "backend", select backend resource group

    ![image](/instructions/open-resource-group.png)

2. On the backend resource group select menu item "Access control (IAM)" -> add
3. On "Add access" blade use:

  1. Select role: **Reader**
  2. Add users: **Add your account** (just for illustration purposes)

    ![image](/instructions/resource-group-add-role.png)

###Get application Insights instrumentation key

1. In search box in the top-middle of the screen type "backend", select backend Application Insights resource
2. Expand "Essentials" section and copy instrumentation key 

    ![image](/instructions/save-instrumentation-key-backend.png)

## Excercise 2. Onboarding applications

TODO: add more details/pictures

### Verify default applications not onboarded with AI:
 - Verify that you have backend application running on HTTPs port 24001 by running https://localhost:24001/?stock=msft in your browser
 - Verify that you have frontend application running on HTTPs port 24002 by running https://localhost:24002

### Onboard NODE.JS application (backend)   
 - From src/start/node run ``npm install``
 - In Azure portal create AI resource for node app and AI resource for aspnet app
 - Insert in src/start/node/package.js immediately after other require declarations:
 ``
 var appInsights = require("applicationinsights");
 appInsights.setup("<instrumentation_key_for_node_app>").start();
``

### Onboard ASP.NET aplication (frontend)   
 - To enable AI for server-sde open \src\start\aspnet\tr24ai\tr24ai\ApplicationInsights.config and replace ``<!-- Insert instrumentation key here-->`` with ``<InstrumentationKey>instrumentation_key_for_aspnet_app</InstrumentationKey>``
 - To enable AI for client side Add JS snippet to the end of the head tag for both Index.cshtml and Details.cshtml. NOTE that you need to add ``disableCorrelationHeaders: false`` to the snippet:    
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

## Excercise 3. Set up application map

## Excercise 4. Find a bug/trace transactions
