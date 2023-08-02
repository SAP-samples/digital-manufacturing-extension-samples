# Unit 2 - Field and Integration Extensions

## Overview

###Field Extensions
The ability to add custom fields to DMC applications fields.

###Integration Extensions
DMC utilizes SAP Integration to integrate with external and other SAP Systems. Customer can utilize predefined  iflows for various systems for the transformation of data. Alternative customers can develop their own or enrich existing ones.
Iflows nodes use XSLT or custom developed exits to transform data into the required format.

## Learning objectives
- Define the Custom Fields in DMC
- Override the default Integration settings from 'Manage Integration Workflows'
- Customize XSLT rules to populate values for the customized fields

## Prerequisites
- Integration Configurations between DMC and S/4 HANA has been setup
- You have access to the SAP CI tenant
- You have access to the DMC tenant
- Plant Conversion Rules configured(this is required if plant id different between DMC and S/4 HANA)

## BTP Components
- SAP Integration Suite
- SAP Extension Suite

## Implementation
Here is the block diagram which shows the integration extensibility.
![](assets/integrationExtensions_architecture.png)

