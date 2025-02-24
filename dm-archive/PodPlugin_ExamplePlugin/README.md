# Example-Custom-POD-Plugins
## Description
This MTA provides 3 example custom plugins which demonstrates the following features:
### 1.  Exposing plugins to Shop Floor Designer (SFD) for use in Production Processes
The [components.json](exampleplugins/webapp/designer/components.json) file defines which plugins should be exposed to SFD and provides the title to display for the plugin in the SFD application through use of the __productionProcessEnabled__ and __productionProcessTitle__ properties.  In the components.json file both the __Example View Plugin__ and __Example Execution Plugin__ are defined for use by SFD.
### 2.  Implementing custom Notification Events into a plugin.
The [Example View Plugin](exampleplugins/webapp/exampleViewPlugin) demonstrates how to subscribe one or more custom __Notification__ events to a plugin.  See the Production Operator Dashboard (POD) Plugin Developer's Guide for more information on implementing notifications.
### 3.  Defining an Execution plugin to run in synchronous or asynchronous mode.
The [Example Execution Plugin](exampleplugins/webapp/exampleExecutionPlugin) demonstrates how to have an execution type plugin run either synchronously or asynchronously.  See the Production Operator Dashboard (POD) Plugin Developer's Guide for more information on implementing execution plugins.
### 4.  Calling public API's from a custom plugin.
The [Example WIP Plugin](exampleplugins/webapp/exampleWipPlugin) demonstrates how to call public API's from a custom plugin.  This plugin calls a public API to get all order details for a given Work Center and displays the results in a Network Graph control.

## Prerequisites
### System
* SAP Cloud Platform Account - Trial account is sufficient
* SAP Digital Cloud Tenant with sample data to run execution

### Skills:
* SAPUI5
* SAP Digital Manufacturing Cloud implementation knowledge 
If you are new to SAP Digital Manufacturing Cloud the Implementation Starter Kit can be of great help. Please check the __Implement__ Section at [SAP Help Portal - Digital Manufacturing Cloud](https://help.sap.com/viewer/product/SAP_DIGITAL_MANUFACTURING_CLOUD/latest/en-US?task=implement_task "SAP Help Portal - Digital Manufacturing Cloud") 

## Getting Started
Please check [SAP Help Portal - Digital Manufacturing Cloud](https://help.sap.com/viewer/product/SAP_DIGITAL_MANUFACTURING_CLOUD/latest/en-US?task=develop_task "SAP Help Portal - Digital Manufacturing Cloud"). In the __Develop__ section you will find the Production Operator Dashboard (POD) Plugin Developer's Guide, which explains in detail how to develop plugins for display and execution in the POD. 

The major steps are:
#### 1. Prepare your SAP Cloud Platform Account
Whether you use Web-IDE or Business Application Studio, You will be developing a Multi-Target Application which includes a HTML5 Module containing the plugin Components for use in POD Designer and the POD.  Follow the Production Operator Dashboard (POD) Plugin Developer's Guide. Special focus on chapter 6 which explains how to create and deploy the required application.
#### 2. Import the example MTA into your development environment and copy relevant sections to the new created project
Copy the example code into the respective folder as described in guide.
#### 3. Register your custom plugins 
#### 4. Create a new POD in the POD Designer
Open the POD Designer application. Your custom plugins should be visible in the POD Designer in the Plugins area. All custom plugins are marked with a small color on the left side of the title. Create your own POD including your plugins.
#### 5. Run the newly created POD

## Running the Example MTA
With only minor changes the example MTA can be deployed and registered to the Service Registry for testing the various features.  The following steps will guide you through the process.
### SAP Cloud Platform Account Steps
#### 1. Import the example MTA into your development environment
#### 2. Modify the [mta.yaml](mta.yaml) file and replace __\<DMC_URL\>__ with the host name where POD Designer is located.
#### 3. Build and Deploy the MTA to your account.
### Service Registry Steps
#### 1. Start the Manage Service Registry application and select __UI Extensions__ tab.
#### 2. Create a new POD Plugin entry
The __URL__ should be set to the URL of your MTA(e.g.; "https://your.mta.url.com").  The __Path__ must be set to __/exampleplugins__.  The __Namespace__ must be set to __sap/ext/exampleplugins__.  Make sure to enable the new extension.
#### 3. Create a new POD in POD Designer
You should see the __Example View Plugin__ and __Example Work In Process__ plugin in the list of available plugins.  You should see the __Example Execution Plugin__ in the list of plugins when assigning a Plugin to an Action or Menu Button.  To test custom notification events in the __Example View Plugin__ you must define the subscription information for the POD and enable notifications in the __Example View Plugin__ configuration options.
#### 4. Run the POD
Start the POD and execute the example plugins.  To test the custom Notification event defined to the the __Example View Plugin__ you must have the plugin displayed in the POD and then run the following Public API (See [Production Operator Dashboard Notification](https://api.sap.com/api/sapdme_notification/overview "Production Operator Dashboard Notification")) to send a message to the plugin where the __subscription__ information matches what is defined in the POD Selection information in the POD.  The message will appear in the Notifications text area in the plugin.
```
POST  "/notification/v1/send"
{
    "eventName": "USER_MESSAGE",
    "subscription": {
        "workCenter": "<WORK_CENTER>",
        "operation": "<OPERATION>",
        "resource": "<RESOURCE>",
        "plant": "<PLANT>"
    },
    "parameters": [
        {
            "name": "message",
            "value": "This is a custom notification message"
        }
    ]
}
```

## How to obtain support
If you have issues with these examples, please open a report using [GitHub issues](../../../../../issues).

## License
Copyright © 2020 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the SAP Sample Code License except as noted otherwise in the [LICENSE file](../../../LICENSE).
