
## UserAssignmentApp
A side-by-side extension using SAP UI5 and public User APIs provided by SAP DM to automate the user assignments to work centers.
Details  please check out SAP Community Blog "Link to be added as soon as published"

## Prerequiste
### 1. Set Up a Destination in Your Subaccount
To call a public API in your coding you first need to setup a destination in your subaccount pointing to the Public API. 
Details you can find on SAP HELP https://help.sap.com/docs/sap-digital-manufacturing/operations-guide/prepare-for-api-integration
### 2. Configure the SAP Cloud Application Router (xs-app.json)
In the xs-app.json file the configuration for your SAP Cloud Application Router, which helps route incoming requests within your app, is defined. 
Make sure it points to the destination you have defined.
### 3. Adjust environment configuration settings in SAP BTP
Issue: Many modern browsers, including Google Chrome, have tightened restrictions on third-party cookies to improve privacy and security.
This can impact authentication flows or application behavior that relies on cookies for session management
Solution: Navigate to the SAP BTP Space where your application is deployed. Locate your environment configuration settings.
Add or modify the variable: COOKIE_BACKWARD_COMPATIBILITY=true
This instructs SAP BTP to maintain compatibility with older cookie behavior, helping resolve login and session issues.

