#ILL Instructions

##Introduction

##Permissions/roles

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

##Onboaridng applicaitons

##Set up application map

##Find a bug/trace transactions
