#ILL Instructions

##Introduction

In the modern world microservices architecture allows to increase development agility and time to market. With the micro services simplicity and high independance you can employ "the best tool for the job". Contiunues delivery and DevOps practices makes development and releases of individual services easy and straightforward.   

Microservices architecture comes at a price of: 

1. Operations Overhead
2. Distributed System Complexity
3. End-to-end transactions resolving complexity
4. Implicit Interfaces and versioning problems

Application Insights makes it easier to monitor the microservices. In this lab we will walk you thru the typical scenarios you'll implement while managing your microservices environment.


## Excercise 1. Configure Application Insights for the different application components

You'll learn how to create Application Insights resource for different components of your microservice and configure access to the telemetry information. This lab works with the simple application that consist of ASP.NET frontend, node.js backend and external dependencies.

![image](/instructions/architecture.png)

###Task 1. Create Application Insights resources

Create Application Insights resources. Azure allows setting access permissions on resource group level. So create each component in it's own resource group.

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

###Task 2. Set up permissions for backend service

You may need to set up different levels of access for the microservice telemetry for different teams in your organization. This is how you can set permission for backend service. 

1. In search box in the top-middle of the screen type "backend", select backend resource group

    ![image](/instructions/open-resource-group.png)

2. On the backend resource group select menu item "Access control (IAM)" -> add
3. On "Add access" blade use:

  1. Select role: **Reader**
  2. Add users: **Add your account** (just for illustration purposes)

    ![image](/instructions/resource-group-add-role.png)

###Task 3. Get application Insights instrumentation key

Application Insights resource represents a bucket of telemetry. Instrumentation key identifies this bucket and needs to be sent alongside with all telemetry items. You'll need to get instrumentation key for the next excercise.

1. In search box in the top-middle of the screen type "backend", select backend Application Insights resource
2. Expand "Essentials" section and copy instrumentation key 

    ![image](/instructions/save-instrumentation-key-backend.png)

## Excercise 2. Configure components to collect telemetry

Application Insights supports telemetry collection from many different languages and frameworks. It is important in microservices environment where every component may be written in it's language or the version of a platform. In this lab we will demo how to onboard JavaScript page, configure ASP.NET application and enable telemetry collection for the node.js application. 

### Task 1. Verify default applications not onboarded with AI

This machine comes with IIS configured to serve both components of the microservice.

1. Verify that you have frontend application running on HTTPs port 24002 by running https://localhost:24002 in the browser
2. Verify that you have backend application running on HTTPs port 24001 by running https://localhost:24001/?stock=msft 

### Task 2. Onboard NODE.JS application (backend)

Application Insights Node.JS SDK is one of the most popular. Enabling of Application Insights for node.js applications is very easy. You need to install npm package and bootstrap the SDK.  

1. Open command line 
1. Type `cd src/start/node` to switch to the folder containing node.js application
3. Run `npm install`. This command will install preconfigured `applicationinsights` npm package
2. Get the **backend** compionent instrumentation key from the previous excercise
3. Open `src/start/node/process.js` and insert immediately after other require declarations:

    ``` node.js
    var appInsights = require("applicationinsights");
    appInsights.setup("<instrumentation_key_for_node_app>").start();
    ```

TODO: Insert screenshot here

### Task 3. Onboard ASP.NET application (frontend)

There are many ways to enable Application Insights for ASP.NET application. In this lab the application already has Application Insights SDK enabled as it would be enabled by Visual Studio. The only modification you need to do is to configure the instrumentation key.

1. Get the **frontend** component instrumentation key from the first excercise 
1. Open folder `\src\start\aspnet\tr24ai\tr24ai`
3. Open file `ApplicationInsights.config`
4. Replace  `<!-- Insert instrumentation key here-->` with the instrumentation key from the step 1 `<InstrumentationKey>instrumentation_key_for_aspnet_app</InstrumentationKey>`

### Task 4. Enabling telemetry collection from the JavaScript (frontend)

There is no reason to use the same instrumentation key for the JavaScript and server side components of the application. With the modern rich UI it is not rare that a single JavaScript UI has many backend dependencies and do not have a "main" frontend backend. In this lab however we will use the same instrumentation key for JavaScript and server side code of the front end component of our microservice.

1. Get the **frontend** component instrumentation key from the first excercise 
1. Open folder `\src\start\aspnet\tr24ai\tr24ai\Views\Home`
2. For the both files - `Details.cshtml` and `Index.cshtml`:
    
    1. Open file
    2. Locate the comment `<!-- Insert JavaScript snippet here -->` just before the ending `</head>` tag
    3. Replace the comment above with this JavaScript snippet. Note you can find the same snippet in the file `snippet.txt` in the same folder

    ``` html
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
    ```
    4. Replace `instrumentation_key_for_aspnet_app` in the inserted snippet to the actual instrumentation key

## Excercise 3. Set up application map




## Excercise 4. Find a bug/trace transactions
