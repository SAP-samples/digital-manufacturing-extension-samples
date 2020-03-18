# Build PaaS Extension in SAP WebIDE.
This repository contains the sample code for building a PaaS Extension.

## Description

This tutorial uses SAP Cloud Platform Extension Factory, serverless runtime to build PaaS Extensions. The extension project can be built and managed using SAP Web IDE.

Requirements
-------------
- An SAP Cloud Platform subaccount in the CF environment with the Application Runtime Entitlement.
- An SAP Cloud Platform subaccount in the Neo environment with SAP Web IDE.

Getting Started
----------------
- Configure Application Runtime Entitlement in SAP Cloud Platform CF.
- Enable Web IDE on SAP Cloud Platform Neo and configure project settings to point to target SAP Cloud Platform CF platform. 
- Create project using multi-target application.
- Add a NodeJS service module to the application (Refer to the sample code).
- Run the application.
- Go to the Digital Manufcaturing Cloud Manage Service Registry app and add an extension manually (For Service JSON, please refer to the help documentation)
- Adjust the trigger endpoints or authentication if required.
- The extensions should be available in Shop Floor Designer as third party services.

Please check [SAP Help Portal - Digital Manufacturing Cloud](https://help.sap.com/viewer/product/SAP_DIGITAL_MANUFACTURING_CLOUD/latest/en-US?task=develop_task "SAP Help Portal - Digital Manufacturing Cloud") for further information.
