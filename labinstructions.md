#ILL Instructions

##Introduction

In the modern world, micro-services architecture allows to increase development agility and time to market. With the micro-services simplicity and high independance you can employ "the best tool for the job" for every service and for every situation. Continuous delivery and DevOps practices make development and releases of individual services easy and straightforward.   

At the same time, micro-services architecture comes at a price of: 

1. Operations overhead
2. Distributed systems complexity
3. Complexity when investigating end-to-end transactions
4. Using implicit interfaces between services is error-prone and can cause versioning problems

In this lab, we will walk you through onboarding your micro-services to Application Insights to demonstrate how it can make management and diagnostics easier.


## Exercise 1. Configure Application Insights for Different Application Components

You'll learn how to create Application Insights resource for different components of your microservice and configure access to the telemetry information. This lab works with a simple application that consist of ASP.NET frontend, Node.JS backend and external dependencies.

![image](/instructions/architecture.png)

###Task 1. Create Application Insights Resources

Create Application Insights resources. Azure allows setting access permissions on resource group level. To demonstrate this scenario, each Application Insights component should be created in its own resource group.

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
6. In the creation form use the following properties to create Application Insights resource for the backend application:

  1. Name: **backend**
  2. Application Type: keep **ASP.NET web application**
  3. Resource Group -> Create new: **backend**
  4. Location: **South Central US**

7. Every Application Insights resource represent a micro-service in your solution. There may be different teams owning **frontend** and **backend** micro-services. Let's set up special permissions for **backend** component.

###Task 2. Set up permissions for backend service

You may need to set up different levels of access for the microservice telemetry for different teams in your organization. This is how you can set permission for backend service. 

1. In search box in the top-middle of the screen type "backend", select backend resource group

    ![image](/instructions/open-resource-group.png)

2. On the backend resource group select menu item "Access control (IAM)" -> add
3. On "Add access" blade use:

  1. Select role: **Reader**
  2. Add users: **Add your account** (just for illustration purposes)

    ![image](/instructions/resource-group-add-role.png)

4. Azure allows set up complex role-based permissions to all resources including Application Insights.

###Task 3. Get application Insights instrumentation key

Application Insights resource represents a telemetry container. Instrumentation key identifies this container and needs to be sent alongside with all telemetry items. You'll need to get instrumentation key for the next exercise.

1. In search box in the top-middle of the screen type "backend", select backend Application Insights resource
2. Expand "Essentials" section and copy instrumentation key 

    ![image](/instructions/save-instrumentation-key-backend.png)

3. Instrumentation key is a telemetry identifier that allows to associate telemetry with a given micro-service.

## Exercise 2. Configure components to collect telemetry

Application Insights supports telemetry collection for services written in many different languages and frameworks. It is important in micro-services environment where every service may be authored using different programming languages or framework version. In this lab, we will demonstrate how to onboard JavaScript page, ASP.NET and Node.JS application. 

### Task 1. Verify default applications not onboarded with AI

This machine comes with IIS configured to serve both components of the microservice.

1. Open command line 
2. Type `cd C:\tr24\lab`
3. Type `git pull`
3. Verify that you have frontend application is running on HTTP port 24002 by running [http://localhost:24002](http://localhost:24002) in browser
4. Verify that you have backend application is running on HTTP port 24001 by running [http://localhost:24001/?stock=msft](http://localhost:24001/?stock=msft)
5. Open Chrome browser and navigate to a stock page, for example, [http://localhost:24002/Home/Details?stock=msft](http://localhost:24002/Home/Details?stock=msft). Start refreshing the page by setting auto-refresh extension to 3 seconds. This will continue to generate traffic to the site.

    ![image](/instructions/refresh.PNG)

5. Now let's onboard applications to Application Insights

### Task 2. Onboard NODE.JS application (backend)

Application Insights Node.JS SDK is one of our most popular SDKs. Enabling of Application Insights for Node.JS applications is very easy. You need to install npm package and bootstrap the SDK.  

1. Open command line 
1. Type `cd C:\tr24\lab\src\start\node` to switch to the folder containing Node.JS application
3. Run `npm install`. This command will install preconfigured `applicationinsights` npm package
2. Get the **backend** component instrumentation key from the previous exercise
3. Open `C:\tr24\lab\src\start\node\process.js` (you can type `code process.js` in command window) and insert immediately after the existing require declarations:

    ``` node.js
    var appInsights = require("applicationinsights");
    appInsights.setup("<instrumentation_key_for_node_app>").start();
    ```

4. Verify that you have backend application is still running on HTTP port 24001 by running [http://localhost:24001/?stock=msft](http://localhost:24001/?stock=msft). Telemetry for node.js application will show up in Azure portal ~1 minute. Meanwhile - let's configure other components.

### Task 3. Onboard ASP.NET application (frontend)

There are many ways to enable Application Insights for ASP.NET application. In this lab the application already has Application Insights SDK enabled as it would be when creating an ASP.NET project in Visual Studio with Application Insights option checked. The only modification you need to do is to configure the instrumentation key.

1. Get the **frontend** component instrumentation key from the first exercise 
2. Open folder `C:\tr24\lab\src\start\aspnet\tr24ai\tr24ai\`
3. Open file `ApplicationInsights.config`
4. Replace  `<!-- Insert instrumentation key here-->` with the instrumentation key from the step 1 `<InstrumentationKey>instrumentation_key_for_aspnet_app</InstrumentationKey>`
5. Restart IIS. Run `cmd` "As Administrator" and type `iisreset` there.    
6. Verify that you have frontend application is still running on HTTP port 24002 by checking [http://localhost:24002](http://localhost:24002) in the browser
7. Open **frontend** component in Azure portal. Live Stream tile should show 1 instance

    ![image](/instructions/live-stream-frontend.png)

8. Click on live stream button to see Application Insights telemetry in realtime.

### Task 4. Enabling telemetry collection from the JavaScript (frontend)

There is no reason to use the same instrumentation key for the JavaScript and server side components of the application. With modern rich UI it is not rare for a single JavaScript UI to have many backend dependencies and not have the "main" frontend backend. In this lab, however, we will use the same instrumentation key for JavaScript and server side code of the frontend component of our microservice.

1. Get the **frontend** component instrumentation key from the first exercise 
1. Open folder `C:\tr24\lab\src\start\aspnet\tr24ai\tr24ai\Views\Home`
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

3. Ensure that you have [http://localhost:24002](http://localhost:24002) still running with auto-refresh extension configured to 3 seconds, so telemetry is generated. It takes some time for telemetry to be processed by Application Insights and appear in the portal. You'll see telemetry from JavaScript in the next exercise.

## Exercise 3. Create a microservice dashboard

When running microservices it is important to have a single pane of glass view to the application behavior. Single view allows to see how performance degradation of one component affects other components and allows you to see the load on all instances of your microservice. In this exercise we will create a dashboard combining basic information from both backend and frontend components.

###Task 1. Create a new dashboard

Create an empty dashboard for your microservices application

1. Open Azure portal, click on "Microsoft Azure" title to open your default dashboard
2. Click a "+ New dashboard" button
3. Dashboard customization page will appear
4. Name your dashboard "My microservice app" and click "Done customizing" in the very top. Now it is your default dashboard and it is empty

    ![image](/instructions/dashboard-step1.png)

5. This dashboard will combine telemetry for all micro-services in your solution.

###Task 2. Add performance charts to the dashboard

One of the big problems in microservices is operations overhead and overall system complexity. In multi-layer scenarios it is easy to see how overall application performance degradation is distributed by layers by placing corresponding charts on top of each other.

1. Open **frontend** application by typing it's name in the search box.  
2. Select "Performance" menu item to open performance blade:

    ![image](/instructions/dashboard-step2-open-frontend.png)

3. Pin performance charts to the dashboard by clicking 📌 (:pushpin:) button in the top right corner of the chart: 

    ![image](/instructions/dashboard-step2-pin-performance-chart.png)

4. Perform steps 1-3 for the **backend** component
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner 
6. Drag and drop charts to place them one on top of another. Click "Done customizing" in the very top when complete

    ![image](/instructions/dashboard-step3-performance-view.png)

7. Note, in the screenshot above frontend avarage execution time is `384 ms`, backend execution time is `346 ms`. You can clearly see that backend execution is a bottleneck.

###Task 3. Add application map to the dashboard

Viewing overall application topology is important for an overview dashboard.

1. Open **frontend** application by typing its name in the search box.  
2. Select "Application Map" menu item
3. Pin Application Map to the dashboard by clicking 📌 (:pushpin:) button 
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner
5. You should see performance charts and application map on the same dashboard. Application Map gives at a glance view on micro-services intercommunication.

###Task 4. View instances data on dashboard

Many performance issues may be solved by scaling components of the multi-service application. You need to see the current state of every instace of your application.

1. Open **frontend** application by typing it's name in the search box
2. Select "Servers" menu item to open servers blade
3. Servers blade shows charts and the list of instances this component it running on. List for **frontend** will be empty as lab machine was set up with the permissions issues. You will see list in **backend** application
4. Click  📌 (:pushpin:) button in the right top corner of the servers list to pin this list to the dashboard

    ![image](/instructions/dashboard-step4-pin-servers-list.png)

4. Perform steps 1-4 for the **backend** component
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner 
6. Drag and drop charts to place servers lists one on top of another

    ![image](/instructions/dashboard-step5-final-dashboard.png)

7. You can see how many instances of every components is currently running and how much CPU they consume. So you make a decision to scale up or down if necessary.

## Exercise 4. Set up application map

Application Map represents topology of your application. It shows health and performance metrics for incoming requests into your application, as well as for outgoing requests that your application is making. In this exercise you will learn how to use Application Map for basic scenarios, as well as how to configure cross-component correlation, which is an experiemental feature. 

###Task 1. View topology of backend application

1. Open Application Map for **backend**. Observe that there are two nodes shown: server and node and remote dependency node. (Depending on the version of the ApplicationMap you might sometimes see interim HTTP grouping node). Note, that remote dependency node is showing signifficant percentage of failing calls, however these errors are not propagated to the callers of backend, because all requests are successful.

    ![image](/instructions/appmap-be.PNG)


2. Observe that there's a dependency call made for every call into **backend** component, so there are the same number of dependency calls as requests. Open ``Filters`` by clicking the button on Application Map header. Note the ratio of 204 responses to 200 responses and compare it with the ratio of failing to successful dependency calls. You can see that every 204 response is caused by failing dependency. In the future, we'll be improving application map, so that filtering by dependency response and or by request response code only shows correlated requests and dependency, so this analysis will be easier. In Exercise 5 of this lab, we'll come back to diagnosing this issue further.

    ![image](/instructions/appmap-be204.PNG)

###Task 2. View topology of frontend application and diagnose a configuration issue.

1. Open Application Map for **frontend**. Observe that there's Client and Server components shown on the map. 

    ![image](/instructions/appmap-fe.PNG)
    
2. For Client component note that its status is shown as failing due to script errors detected on the page. Click on the red icon to open the script error view. Note that script error that is causing issues on the client side.

    ![image](/instructions/scriptError.PNG)

3. Note that one of server-side dependencies, ``www.narayaniservices.com`` is showing 100% of failures. Click on ``...`` button to open failed calls, click on ``false`` to open the blade with dependency call samples and then click on of them to see dependency details page. Note that path http://www.narayaniservices.com/images/header-img-rfp.jp is not a valid image url:

    ![image](/instructions/invalidUrl.PNG)

4. Open web.config for **frontend** application and correct the URL specified as HeaderUrl by changing it to http://www.narayaniservices.com/images/header-img-rfp.jpg. Navigate to http://localhost:24002/Home/Details?stock=msft and validate that header is now appearing as expected.
5. Once the issue is fixed you will start seeing successful dependencies appearing for ``www.narayaniservices.com``.


###Task 3. Configure error thresholds, filters and pinning.
1. Open Application Map for **frontend** component.
2. Cick on Options button on the header to open Options pane. Try changing error and warning thresholds for Application Map so that all nodes appear green. Consider why in some cases thresholds should be adjusted to a higher level.
3. Open Filters blade to filter the map by ``GET Home/Header`` operation. Apply your changes. Note how only dependencies that are invoked as part of this call are shown.

    ![image](/instructions/appmap-fe-filter.PNG)
    
4. Click on 📌 (:pushpin:) button in the top right corner to save the updated map to your dashboard. Close the blade and reload the page. Note that the map on the dashboard has preserved custom filter settings.

## Exercise 5. Find a bug/trace transactions
Out of the box Application Insights allows to track the transaction execution accross the multiple layers. Application Insights is using the root-parent-self combination of telemetry item identifiers. In this exercise you'll learn how Application Insights correlates telemetry items and how cross-components correlation identifiers are propagated across the layers.

###Task 1. Root-parent-self correlation concepts
1. Open **frontend** application blade.
2. Select a failed request by clicking on failed requests chart, then choosing "GET Home/Stock" request in the table, and, finally, clicking on one of failed requests.

    ![image](/instructions/select-stock-failed-request.png)

3. Click on "..." to open all properties and type "id" in the filter.

    ![image](/instructions/get-failed-request-correlation-id.png)

4. Copy the Operation Id. In the screenshot above it has value `STYz`.
5. Return to the **frontend** application overview blade and click "Analytics" in the top menu
6. Type the analytics query:

    ```
    (requests | union dependencies | union pageViews) 
    | where operation_Id == "STYz"
    | project timestamp, itemType, name, id, operation_ParentId, operation_Id
    ```
7. In the result view note that all telemetry items share the "root" operation_Id. When ajax call made from the page - new unique id `qJSXU` is assigned to the dependency telemetry and pageView's id is used as operation_ParentId. In turn server request uses ajax's id as parent id.

    | itemType   | name                      | id           | operation_ParentId | operation_Id |
    |------------|---------------------------|--------------|--------------------|--------------|
    | pageView   | TR24 AI for Microservices |              | STYz               | STYz         |
    | dependency | GET /Home/Stock           | qJSXU        | STYz               | STYz         |
    | request    | GET Home/Stock            | KqKwlrSt9PA= | qJSXU              | STYz         |
    | dependency | GET /                     | bBrf2L7mm2g= | KqKwlrSt9PA=       | STYz         |


###Task 2. Cross-component correlation
1. Open the failed request blade from the Task 1.

    ![image](/instructions/get-failed-request-correlation-id.png)

2. Failed request has a dependency call with the name `localhost | jQfGIonzN758c9rYzdlnz9Rsni8mTQ3DDnv60BtSdRg=`
3. The id `jQfGIonzN758c9rYzdlnz9Rsni8mTQ3DDnv60BtSdRg=` represents SHA256 for the instrumentation key of **backend** component. In the next versions of UI we will open the related component automatically. In this version of UI - copy the request operation Id.
4. Open **backend** component
5. Click on "Analytics" button
6. Type the query 

    ```
    (requests | union dependencies) 
    | where operation_Id == "STYz"
    ```

7. Single request telemetry item will be returned. You can see that it has a `source` field with the value `VahsfsNpv5z8PKnCLvB4+IZqyuiiyXfbC36J3k20ffc=`. It is a SHA256 of **frontend** component.

###Task 3. Propagate correlation id via http headers
1. Open `C:\tr24\lab\src\start\node\process.js` and insert the following code snippet after appInsights object instantiation. It will read the value of the header `x-ms-request-root-id` and assign its value to the dependency telemetry item:

    ``` js
    appInsights.client.addTelemetryProcessor(function(envelope, context){
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

    ```
2. Replace `http.get({ host: "finance.google.com", path: path + stock }, function (response) {` with the following lines. This will read the correlation id header from the incoming request and pass it to the http dependency call as http header:

    ``` js
    // read the correlation header
    var id = undefined;
    if (req && req.headers){
        id = req.headers["x-ms-request-root-id"];
    }

    // set the correlation header to the outgoing http request
    var headers = (id !== undefined) ? {"x-ms-request-root-id": id} : {};
    http.get({ host: "finance.google.com", path: path + stock, headers: headers }, function (response) {
    ```

3. Restart IIS. Run `cmd` "As Administrator" and type `iisreset` there.
4. Open [http://localhost:24002/](http://localhost:24002/) and click couple links. Make sure you had at least couple failures while browsing individual stocks
5. Open the latest request telemetry in **backend** application. It may take up to two minutes for telemetry to show up. Click on "Server Response Time" chart, pick "GET /" operaiton. See that requests now are correlated with dependency call:

    ![image](/instructions/now-they-are-correlated.png)

6. Now you see that requests with the status code 204 have a failed dependency calls associated with them. As applicaiton owner you can find out that the dependency url has incorrect query string parameters.
