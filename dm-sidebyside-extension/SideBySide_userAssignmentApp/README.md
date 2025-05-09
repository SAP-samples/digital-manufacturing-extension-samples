
## UserAssignmentApp
A side-by-side extension using SAP UI5 and public User APIs provided by SAP DM to automate the user assignments to work centers.
Details  please check out SAP Community Blog "Link to be added as soon as published"

## Prerequiste
### 1. Set Up a Destination in Your Subaccount
To call a public API in your coding you first need to setup a destination in your subaccount pointing to the Public API. 
Details you can find on SAP HELP https://help.sap.com/docs/sap-digital-manufacturing/operations-guide/prepare-for-api-integration
#### 2. Configure the SAP Cloud Application Router (xs-app.json)
In the xs-app.json file the configuration for your SAP Cloud Application Router, which helps route incoming requests within your app, is defined. 
Make sure it points to the destination you have defined.
#### 3. Adjust environment configuration settings in SAP BTP
Issue: Many modern browsers, including Google Chrome, have tightened restrictions on third-party cookies to improve privacy and security.
This can impact authentication flows or application behavior that relies on cookies for session management
Solution: Navigate to the SAP BTP Space where your application is deployed. Locate your environment configuration settings.
Add or modify the variable: COOKIE_BACKWARD_COMPATIBILITY=true
This instructs SAP BTP to maintain compatibility with older cookie behavior, helping resolve login and session issues.
=======
## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Sat Feb 22 2025 12:20:07 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.16.4|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A|
|**Module Name**<br>userAssignmentApp|
|**Application Title**<br>App Title|
|**Namespace**<br>|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.133.0|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

## userAssignmentApp

An SAP Fiori application.

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)

