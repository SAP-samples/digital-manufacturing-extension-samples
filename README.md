[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/digital-manufacturing-extension-samples)](https://api.reuse.software/info/github.com/SAP-samples/digital-manufacturing-extension-samples)

# SAP Digital Manufacturing Extension Samples
SAP Digital Manufacturing provides an out-of-the-box Manufacturing Execution System (MES) to run production on the shop floor. However, based on the experience gained from customer and partner projects, we also know that a successful MES must have the capability to be extended. With the new releases of Digital Manufacturing, the options for extensibility have made a significant step forward. Using the sample extensions provided will allow you to learn and understand how to build your own extensions to use with SAP Digital Manufacturing.

## Description
The [POD Plugins Developer Guide](https://help.sap.com/docs/sap-digital-manufacturing/pod-plugin-developer-s-guide/introduction) provides more details on developing custom plugins. Some of the templates can be referred as following code snippets.

- POD Plugin Extension
- Core Plugin Extension
- Side by side Extension
- Integration Extension
- In-App Service Extension
- ML Extension

## Sample Extensions
| Name                                                                                                                           | Description                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| [Sample Execution Plugin](./dm-podplugin-extensions/PodPlugin_ExamplePlugin/exampleplugins/webapp/exampleExecutionPlugin/) | This sample demonstrates how to implement a Execution type plugin | 
| [Sample View Plugin](./dm-podplugin-extensions/PodPlugin_ExamplePlugin/exampleplugins/webapp/exampleViewPlugin/) | This sample demonstrates how to implement a View type plugin | 
| [View POD Plugin Template ](./dm-podplugin-extensions/ViewPodPluginTemplate_And_Example/) | This sample demonstrates how to build a sample view plugin from scratch |  
| [Execution POD Plugin Template ](./dm-podplugin-extensions/ExecutionPodPluginTemplate_and_Example/) | This sample demonstrates how to build a sample execution plugin from scratch |  
| [Inbound Integration Extension with XSLT](./dm-integration-extensions/)                       | Sample XSLT to map custom fields for Production Order                                              | 
| [Outbound Integration Extension with customized workflows](./dm-integration-extensions/)                                          | This sample demonstrates using customized CPI workflow to pass additional information from DM to ERP                                                                         | 
| [Next Number Extension with Mongo DB ](./dm-inapp-service-extensions/dm-nextnumber-extensions/batch-nn-mongo-db/)                               | This sample demonstrates how to build write an extension function to generate next numbers using Mongo DB                                                     | 
| [Next Number Extension with Postgres](./dm-inapp-service-extensions/dm-nextnumber-extensions/batch-nn-postgresql/) | This sample demonstrates how to build write an extension function to generate next numbers using Postgres | 
| [DM Execution - storing temporary process variables in MSSQL](./dm-inapp-service-extensions/api-mssql-nodejs/) | This sample demonstrates how to store variables from DM execution in an external DB managed from kyma |
| [Custom URL Integration POD plugin](./dm-podplugin-extensions/PodPlugin_UrlIntegration/) | This sample demonstrates how to build a sample custom plugin for URL Integration |  
| [Custom Scrap Confirmation with PPD](./dm-podplugin-extensions/PodPlugin_CustomScrapConfirmation/) | This sample demonstrates how to build a sample custom plugin for Scrap Confirmation |  
| [Custom Assembly POD](./dm-sidebyside-extension/SideBySide_AssemblyPOD_CF/) | This sample demonstrates how to build a side by side extension for Assembly using DM public APIs |  
| [Side by side Extension Template on Kyma](./dm-sidebyside-extension/SideBySide_UI5/) | This sample demonstrates how to build a side by side extension in Kyma | 
| [Custom AuditLog App](./dm-sidebyside-extension/AuditlogUIExtension/) | This sample demonstrates how to build a side by side extension for customized auditlog app |

More samples on core plugin extensions can be found here - [Core Plugin Extension Samples](./dm-coreplugin-extensions/)


## Digital Manufacturing Extensibility Bootcamp 

- [Day 1](https://dam.sap.com/mac/u/a/pDdSZQp?rc=10&doi=SAP957994)[ (Recording) ](https://dam.sap.com/a/dkJWeBZ?rc=10&doi=SAP1140477)
- [Day 2](https://dam.sap.com/mac/u/a/PbWRLb2?rc=10&doi=SAP957995)[ (Recording) ](https://dam.sap.com/mac/u/a/99zd9N9?rc=10&doi=SAP1140482)
- [Day 3](https://dam.sap.com/mac/u/a/8UYGinY?rc=10&doi=SAP957996)[ (Recording) ](https://dam.sap.com/mac/u/a/qnKW7DQ?rc=10&doi=SAP1140508)
- [Day 4](https://dam.sap.com/mac/u/a/xrga4PA?rc=10&doi=SAP957997)[ (Recording) ](https://dam.sap.com/mac/u/a/1Zw1268?rc=10&doi=SAP1140543)
- [Day 5](https://dam.sap.com/mac/u/a/GLgzgDT?rc=10&doi=SAP957998)[ (Recording) ](https://dam.sap.com/mac/u/a/MtoQ6r1?rc=10&doi=SAP1140547)
- [Day 6](https://dam.sap.com/mac/u/a/F6yVn4h?rc=10&doi=SAP957999)[ (Recording) ](https://dam.sap.com/mac/u/a/XYckRm8?rc=10&doi=SAP1140550)
- [Day 7](https://dam.sap.com/mac/u/a/UnYhk5B?rc=10&doi=SAP958000)[ (Recording) ](https://dam.sap.com/mac/u/a/jpYey1X?rc=10&doi=SAP1140552)


## Few Real World Customer Examples
![](bootcampdocs/assets/indexLectureSlide33.png)


## Useful Links
- [SAP Customer Influence](https://influence.sap.com/sap/ino/#/campaign/3537)  for Digital Manufacturing

## How to obtain support
If you have issues with a sample, please open a report using [GitHub issues](../../issues).

## License
Copyright © 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, v2.0 except as noted otherwise in the  [LICENSE](LICENSES/Apache-2.0.txt).
