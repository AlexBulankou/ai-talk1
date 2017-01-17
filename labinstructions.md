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

1. Verify that you have frontend application is running on HTTP port 24002 by running http://localhost:24002 in the browser
2. Verify that you have backend application is running on HTTP port 24001 by running http://localhost:24001/?stock=msft 

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
4. Verify that you have backend application is still running on HTTP port 24001 by running http://localhost:24001/?stock=msft 

TODO: Insert screenshot here

### Task 3. Onboard ASP.NET application (frontend)

There are many ways to enable Application Insights for ASP.NET application. In this lab the application already has Application Insights SDK enabled as it would be enabled by Visual Studio. The only modification you need to do is to configure the instrumentation key.

1. Get the **frontend** component instrumentation key from the first excercise 
1. Open folder `src\start\aspnet\tr24ai\tr24ai\bin`
3. Open file `ApplicationInsights.config`
4. Replace  `<!-- Insert instrumentation key here-->` with the instrumentation key from the step 1 `<InstrumentationKey>instrumentation_key_for_aspnet_app</InstrumentationKey>`
5. Verify that you have frontend applicationis still running on HTTP port 24002 by running http://localhost:24002 in the browser
6. Open **frontend** component in Azure portal. Live Stream tile should show 1 instance

    ![image](/instructions/live-stream-frontend.png)

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


## Excercise 3. Create a microservice dashboard

When running a microservices it is important to have a single pane of glass view to the application behavior. Single view allows to see how performance degradation of one component affects other and how to see the load on all instances of your microservice. In this excercise we will create a dashboard combining basic information from both backend and frontend components.

###Task 1. Create a new dashboard

Create an empty dashboard for your microservices application

1. Open Azure portal, click on "Microsoft Azure" title to open your default dashboard
2. Click a "+ New dashboard" button
3. Dashboard customization page will appear
4. Name your dashboard "My microservice app" and click "Done customizing" in the very top. Now it is your default dashboard and it is empty

    ![image](/instructions/dashboard-step1.png)


###Task 2. Add performance charts to the dashboard

One of the big problems in microservices is an operations overhead and overall system complexity. In some multi-layer scenarios it is easy to see how overall application performance degradation is distributed by layers by placing corresponding charts on top of each other.

1. Open **frontend** application by typing it's name in the search box.  
2. Select "Performance" menu item to open performance blade:

    ![image](/instructions/dashboard-step2-open-frontend.png)

3. Pin performance charts to the dashboard by clicking 📌 (:pushpin:) button in the top right corner of the chart: 

    ![image](/instructions/dashboard-step2-pin-performance-chart.png)

4. Perform steps 1-3 for the **backend** component
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner 
6. Drag and drop charts to place them one on top of another. Click "Done customizing" in the very top when complete

    ![image](/instructions/dashboard-step3-performance-view.png)

###Task 3. Add application map to the dashboard

Viewing overall application topology is important for an overview dashboard.

1. Open **frontend** application by typing it's name in the search box.  
2. Select "Application Map" menu item
3. Pin Application Map to the dashboard by clicking 📌 (:pushpin:) button 
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner
5. You should see performance charts and application map on the same dashboard

###Task 4. View instances data on dashboard

Many performance issues may be solved by scaling components of the multi-service application. You need to see the current state of every instace of your application.

1. Open **frontend** application by typing it's name in the search box.  
2. Select "Servers" menu item to open servers blade
3. Servers blade shows charts and the list of instances this component it running on
4. Click  📌 (:pushpin:) button in the right top corner of the servers list to pin this list to the dashboard

    ![image](/instructions/dashboard-step4-pin-servers-list.png)

4. Perform steps 1-4 for the **backend** component
5. Open default dashboard by clicking on "Microsoft Azure" title in the top left corner 
6. Drag and drop charts to place servers lists one on top of another

    ![image](/instructions/dashboard-step5-final-dashboard.png)

## Excercise 4. Configure Application Map

Application Map represents topology of your application. It shows health and performance metrics for incoming requests into your application, as well as for outgoing requests that your application is making. In this exercise you will learn how to use Application Map for basic scenarios, as well as how to configure cross-component correlation, which is an experiemental feature. 

###Task 1. View topology of backend application

1. Open Application Map for **backend**. Observe that there are two nodes shown: server and node and remote dependency node. Note, that remote dependency node is showing signifficant percentage of failing calls, however these errors are not propagated to the callers of backend, because all requests are successful.

    ![image](/instructions/appmap-be.PNG)

2. Click on ``...`` button on ``finance.google.com`` remote dependency and open failed calls. See if there is anything unusual about the failing calls.
3. Observe that there's a dependency call made for every call into **backend** component. Open ``Filters`` by clicking the button on Application Map header and apply the filter to only show responses with 204 status code. Note the ratio of 204 responses to 200 responses and compare it with the ratio of failing to successful dependency calls.

    ![image](/instructions/appmap-be204.PNG)

###Task 2. View topology of frontend application and diagnose a configuration issue.

1. Open Application Map for **frontend**. Observe that there's Client and Server components shown on the map. 

    ![image](/instructions/appmap-fe.PNG)
    
2. For Client component note that its status is shown as failing due to script errors detected on the page. Click on the red icon to open the script error view.
3. Note that one of server-side dependencies, ``www.narayaniservices.com`` is showing 100% of failures. Click on ``...`` button to open failed calls. Try to understand the reason, why there hasn't be a single successful call, which for remote dependencies often indicates configuration error.
4. Try to understand and fix the issue. Hint: open web.config for **frontend** application and review the URL specified as HeaderUrl.
5. Once the issue is fixed you will start seeing successful dependencies appearing for ``www.narayaniservices.com``.

###Task 3. View multi-server application map (experimental feature)

1. This task uses experimental Application Map feature that is not yet available to everyone. To ensure you're loading the version of the portal with this feature enabled, reload the portal with the following link: https://portal.azure.com/?appInsightsExtension_OverrideSettings=appMapExperience:appMapLegacyErrorPaneMultiServer

2.  Tag both **frontend** and **backend** applications with the same key:value pair. To add the tag, open Application Insights resource and click on Tags in the resource menu. In the Tags blade and key and value and click Save. Make sure to use the same tag key and value for both **frontend** and **backend**

    ![image](/instructions/appmap-tags.PNG)

3. Open Application Map for **backend** component and click Filters on the header to open Filters blade.
4. Under tags section on the Filters blade, check the tag that you just added.

    ![image](/instructions/appmap-tags-apply.PNG)

5. Click ``Update`` to apply your changes and close Filters blade. Click ``Refresh`` on the Application Map header to see your changes. 
6. You can now see **frontend** application appearing on Application Map alongside **backend** application.
7. Select **backend** application node on the map. You will see incoming calls from **frontend** application.

    ![image](/instructions/appmap-be-x.PNG)

8. Now select **frontend** application node on the map. You will see outgoing calls to **backend** application. Spend some time studying how backend component is displayed in this view. It is showing both dependency metrics for the call originating from frontend component, as well as server metrics for the calls originating from all other potential callers into backend component.

    ![image](/instructions/appmap-fe-x.PNG)


###Task 4. Configure error thresholds, filters and pinning.
1. Open Application Map for **frontend** component.
2. Cick on Options button on the header to open Options pane. Try changing error and warning thresholds for Application Map so that all nodes appear green. Consider why in some cases thresholds should be adjusted to a higher level.
3. Open Filters blade to filter the map by ``GET Home/Header`` operation. Apply your changes. Note how only dependencies that are invoked as part of this call are shown.

    ![image](/instructions/appmap-fe-filter.PNG)
    
4. Click on 📌 (:pushpin:) button in the top right corner to save the updated map to your dashboard. Close the blade and reload the page. Note that the map on the dashboard has preserved custom filter settings.

## Excercise 5. Find a bug/trace transactions

Out of the box Application Insights allows to track the transaction execution accross the multiple layers. Application Insights is using the root-parent-self combination of telemetry item identifiers. In this excercise you'll learn how Application Insights correlate telemetry items and how cross-components correlation identifiers propagated across the layers.

###Task 1. Root-parent-self correlation concepts
1. Open **frontend** application blade.
2. Select the failed request by clicking on failed requests chart, than choosing "GET Home/Stock" request in the table and finally clicking on one of failed requests.

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
7. In the result view note that all telemetry items share the "root" operation_Id. When ajax call made from the page - new unique id `qJSXU` assigned to the dependency telemetry and pageView's id is used as operation_ParentId. In turn server request uses ajax's id as a parent id.

    | itemType   | name                      | id           | operation_ParentId | operation_Id |
    |------------|---------------------------|--------------|--------------------|--------------|
    | pageView   | TR24 AI for Microservices |              | STYz               | STYz         |
    | dependency | GET /Home/Stock           | qJSXU        | STYz               | STYz         |
    | request    | GET Home/Stock            | KqKwlrSt9PA= | qJSXU              | STYz         |
    | dependency | GET /                     | bBrf2L7mm2g= | KqKwlrSt9PA=       | STYz         |


###Task 2. Cross components correlation
1. Open the failed request blade from the Task 1.

    ![image](/instructions/get-failed-request-correlation-id.png)

2. Failed request has a dependency call with the name `localhost | jQfGIonzN758c9rYzdlnz9Rsni8mTQ3DDnv60BtSdRg=`
3. The id `jQfGIonzN758c9rYzdlnz9Rsni8mTQ3DDnv60BtSdRg=` represents SHA256 for the instrumentation key of **backend**. In the next versions of UI we will open the related component automatically. In this version of UI - copy the request operation Id.
4. Open **backend** component
5. Click on "Analytics" button
6. Type the query 

    ```
    (requests | union dependencies) 
    | where operation_Id == "STYz"
    ```

7. Single request telemetry item will be returned. You can see that it has a `source` field with the value `VahsfsNpv5z8PKnCLvB4+IZqyuiiyXfbC36J3k20ffc=`. It is a SHA256 of **frontend** component.

###Task 3. Propagate correlation id thru http headers
1. Open `src/start/node/process.js` and insert this code after appInsights object instantiation. This code will read the value of the header `x-ms-request-root-id` and assign it's value to the dependency telemetry item:

``` js
appInsights.client.addTelemetryProcessor((envelope, context) => {
    if (envelope.data.baseType === "Microsoft.ApplicationInsights.RemoteDependencyData") {
        var reqOptions = context["http.RequestOptions"];
        // get the correlation id from headers
        var id = reqOptions && reqOptions.headers && reqOptions.headers["x-ms-request-root-id"];
        if (id !== undefined) {
            // associate telemetry item with this correlaiton id
            envelope.tags["ai.operation.id"] = id;
        }
    }
    return true;
});

```
2. Replace `http.get({ host: "finance.google.com", path: path + stock }, function (response) {` with the following lines. This will read the correlation id header from the incoming request and pass it to the http dependency call as http header:

``` js
// read the correlation header
var id = req && req.headers && req.headers["x-ms-request-root-id"];

// set the correlation header to the outgoing http request
var headers = (id !== undefined) ? {"x-ms-request-root-id": id} : {};
http.get({ host: "finance.google.com", path: path + stock, headers }, function (response) {
```

3. Restart IIS
4. Open the latest request telemetry in **backend** application. See that it is correlation now with the dependency call:

    ![image](/instructions/now-they-are-correlated.png)

5. You may see that requests with the status code 204 will have a failed dependency calls inside.