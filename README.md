# Using Application Insights to detect and diagnose issues in a microservices environment

## Abstract

If your solution consists of multiple services communicating to each other, you can use Application Insights to identify what service and functionality is the root cause of the issue. We will start by onboarding both services (one running on ASP.NET Core with JavaScript front end, another one running on Node.JS) to Application Insights SDK. We will then detect an occasional failure resulting from a bug in the service to service communication and will use Application Insights APM UI to diagnose what service and what call is the root cause. After that we'll explore what additional custom telemetry can be added to make investigation faster and simpler.

**Objectives**:

- Understand Application Insights offering for ASP.NET Core, Node.JS and JavaScript applications and onboard them to Application Insights SDK.
- Use Application Insights APM UI in Azure portal, including Application Map and Metrics Explorer to perform root-cause analysis of cross-service communication failures.
- Understand how I can add Application Insights custom telemetry to my application to streamline my investigations.

## Setup VM
- Sync sources
- Install iisnode for IIS 7.x/8.x: [x86](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x86.msi) or [x64](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x64.msi) - choose bitness matching your system
- Install [Status Monitor](http://go.microsoft.com/fwlink/?LinkID=522371&clcid=0x409)
- Create website in IIS and point it to \src\start\node directory
  - Use HTTPS and port 24001
  ![img](/instructions/1.PNG)
- Create website in IIS and point it to src\start\aspnet\tr24ai\tr24ai directory
  - Use HTTPS and port 24002
- Load website: https://localhost:24002/

## Lab instructions

Lab instructions located [here](/labinstructions.md)
