# Using Application Insights to detect and diagnose issues in a microservices environment

## Abstract

If your solution consists of multiple services communicating to each other, you can use Application Insights to identify what service and functionality is the root cause of the issue. We will start by onboarding both services (one running on ASP.NET Core with JavaScript front end, another one running on Node.JS) to Application Insights SDK. We will then detect an occasional failure resulting from a bug in the service to service communication and will use Application Insights APM UI to diagnose what service and what call is the root cause. After that we'll explore what additional custom telemetry can be added to make investigation faster and simpler.

**Objectives**:

- Understand Application Insights offering for ASP.NET Core, Node.JS and JavaScript applications and onboard them to Application Insights SDK.
- Use Application Insights APM UI in Azure portal, including Application Map and Metrics Explorer to perform root-cause analysis of cross-service communication failures.
- Understand how I can add Application Insights custom telemetry to my application to streamline my investigations.

## Setup VM
- Install [GIT for Windows](https://git-scm.com/download/win)
- Sync sources
  - `cd c:\tr24\`
  - `git clone https://github.com/AlexBulankou/ai-talk1.git lab`
  - `cd lab`
- Install [latest Node.js](https://nodejs.org/en/download/) build for Windows
- Install [URL Rewrite](http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=urlrewrite2)
- Install iisnode for IIS 7.x/8.x: [x86](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x86.msi) or [x64](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x64.msi) - choose bitness matching your system
- Install [Status Monitor](http://go.microsoft.com/fwlink/?LinkID=522371&clcid=0x409), restart IIS
- Create website in IIS and point it to `\src\start\node` directory
  - Use HTTP and port 24001
  ![img](/instructions/1.PNG)
- Create website in IIS and point it to `src\start\aspnet\tr24ai\tr24ai` directory
  - Use HTTP and port 24002
- Load website: http://localhost:24002/

##Notes from Content Owner meeting
1. [Recording](https://microsoft.sharepoint.com/teams/TRLabs/_layouts/15/Lightbox.aspx?url=https%3A%2F%2Fmicrosoft.sharepoint.com%2Fteams%2FTRLabs%2FShared%20Documents%2FTR24%20Content%20Owner%20Meeting%20-%20Option%202%20Recording.mp4)
2. No corpnet access from the lab
3. Upload VM to \\holhandoff\TR24handoff
4. Lab content portal: https://microsoft.sharepoint.com/teams/TRLabs 
5. Lab instructions sample template: https://microsoft.sharepoint.com/teams/TRLabs/_layouts/15/WopiFrame.aspx?sourcedoc=%7B7C5FFC38-726B-45D2-9F86-7D46D69193B3%7D&file=Simplified%20Template%20Example.docx&action=default

## Lab instructions

Lab instructions located [here](/labinstructions.md)
