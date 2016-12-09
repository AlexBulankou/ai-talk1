## Setup
- Sync sources
- Install iisnode for IIS 7.x/8.x: [x86](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x86.msi) or [x64](https://github.com/azure/iisnode/releases/download/v0.2.21/iisnode-full-v0.2.21-x64.msi) - choose bitness matching your system
- Create website in IIS and point it to \src\start\node directory
  - Use HTTPS and port 24001
  ![img](/instructions/1.PNG)
- Create website in IIS and point it to src\start\aspnet\tr24ai\tr24ai directory
  - Use HTTPS and port 24002
- Load website: https://localhost:24002/