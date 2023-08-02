# Exercise 5 - Machine Monitoring

## Overview
In this exercise, we would like show you how you can listen to business events or machine events on the shop floor and trigger necessary action via production process. 

## Step 1: Design Production Process
1. Go to Design Production Processes app and create a Production Process e.g. MonitorShopFloorEvents
![](assets/Exercise_5/CreateProductionProcess.png)
2. Create a Cloud Process e.g. MonitorResourceStatus
![](assets/Exercise_5/CreateCloudProcess.png)
3. Add Start and End Control and 'Create Alert' Process into Canvas.
![](assets/Exercise_5/AddControlsAndProcess.png)
4. Add Input Parameters for Start Control.
![](assets/Exercise_5/CreateInputStartParams.png)

        {
                inComments (String)
                inPlant (String)
                inResource (String)
                inWorkcenter (String)
                inDescription (String)
        }  
5. Create context for Alert, and maintain values for the user information as appropriate. 
![](assets/Exercise_5/CreateAlertContext.png)

        {
            alertNotificationType : "alert"
            alertSubscription : [{"subscriptionType":"\"user\"","value":"\"\""}]
            alertTypeId : "Supervisor Request"
            applicationId : "dmc"
            contextData : {"DME_Comments":"'inComments'","DME_Plant":"'inPlant'","DME_Workcenter":"'inWorkcenter'","DME_Resource":"'inResource'"}
            contextId : "DME_Shopfloor"
            createdBy : {"emailId":"\"\"","firstName":"\"\"","lastName":"\"\""}
            description : 'inDescription'
            processor : {"emailId":"\"\"","firstName":"\"\"","lastName":"\"\""}
        }
6. Deploy the Production Process.
![](assets/Exercise_5/DeployProductionProcess.png)
7. Publish production process to Service Registry. 
![](assets/Exercise_5/PublishToServiceRegistry1.png)

## Step 2: Create Automatic Trigger
1. Go to Manage Automatic Triggers app, and select 'Business Rules' tab. 
![](assets/Exercise_5/ManageAutomaticTriggers.png)
2. Create new Business Rule named 'ResourceStatusChanged', select Event Type to be 'Resource Status Changed', and add all relevant conditions.
![](assets/Exercise_5/CreateNewBusinessRule.png)
3. Select Cloud Process 'MonitorResourceStatus' as action, and the full name of this cloud process should be 'P_MonitorShopFloorEvents_MonitorResourceStatus'.
![](assets/Exercise_5/SelectAction.png)
4. Fill Input params for the action.
![](assets/Exercise_5/FillInputParamsForAction.png)

        {
            "inComments": "<Self-designed Comment>",
            "inDescription": "Resource Breakdown",
            "inPlant" : 'plant',
            "inResource":  'resource',
            "inWorkcenter": "WC-LIFT",
        }

## Step 3: Trigger Resource Change
From the DMC Partner POD, Click on Actions Buttion and change the resource status to 'Unscheduled Down'. We are simulating a resource down scenario which will essentially be triggered from the shop floor monitoring tags on the equipment. 
![](assets/Exercise_5/TriggerResourceChange.png)
![](assets/Exercise_5/TriggerResourceChange2.png)

## Step 4: Monitor Alerts from Supervisor
Go to Manage Alerts application, and you will see the supervisor request that has been created to act on Resource down situation. 
![](assets/Exercise_5/MonitorAlerts.png)









