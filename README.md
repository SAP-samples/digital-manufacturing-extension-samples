[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/digital-manufacturing-extension-samples)](https://api.reuse.software/info/github.com/SAP-samples/digital-manufacturing-extension-samples)

# SAP Digital Manufacturing Extension Samples
SAP Digital Manufacturing provides an out-of-the-box Manufacturing Execution System (MES) to run production on the shop floor. However, based on the experience gained from customer and partner projects, we also know that a successful MES must have the capability to be extended. With the new releases of Digital Manufacturing Cloud, the options for extensibility have made a significant step forward. Using the sample extensions provided will allow you to learn and understand how to build your own extensions to use with SAP Digital Manufacturing Cloud.

## Description
In SAP Digital Manufacturing we distinguish between the following major areas for extensions:

**In-App Extensions**

The ability to extend a core DMC application* by the available extension points (e.g. extend existing API, trigger a parallel processes, augment API outputs,…etc.). This spectrum of this extensibility use case can go from simple to complex if the logic of the extension needs to call API’s from DMC. 

If the extension is emulated in DMC PaaS account, the infrastructure will have to be managed separately including scaling, deploying,...etc. while in the Kyma Runtime environment it’s fully SAP managed.

*Limited DMC application support today for this use case

Personas: 

- Software Developer

**Process Extensions** 

An extension that will be called from the DMC Production Process Designer process flow that will be executed in the DMC Process Engine (PE) (e.g. extension could trigger a parallel process in an external system, augment the core process flow,…etc.).  Provides flexibility to adapt processes within and outside DMC.

The extension point is usually triggered manually by an operator from the production operator dashboard or triggered from machines automatically as a subscription.

Personas:

- Business User
- Software Developer (NodeJs, Microservices)

**POD Extensions** 

A custom plug-in extension to the DMC Production Operation Dashboard (POD).  DMC will treat the custom plugin as it it’s a core plugin (e.g. automatically participates in the overall  lifecycle of the POD and receives all appropriate messages).

The application can be built using local editors such as Visual Studio Code. 

Personas:

- Software Developer (JavaScript, UI5)

**Field Extensions**

Adding custom fields to DMC applications fields.

Personas:

- Business User


**Side by Side Extensions**

Develop a separate side by side custom application, including a UI, that can be integrated via public APIs and extensions with DMC.

The application can be built using local editors such as Visual Studio Code. 

Personas:

- Software Developer

**Integration Extensions**

DMC utilizes SAP Integration to integrate with external and other SAP Systems. Customer can utilize predefined  iflows for various systems for the transformation of data. Alternative customers can  develop their own or enrich existing ones. iflows nodes use XSLT or custom developed exits to transform data into the required format.

The flows can be augmented with custom extensions written by a developer in the case the iflows are not capable of transforming the date to the desired format, or other data are needed to enrich the existing data.

Personas:

- Software Developer
- Business User

**KPI Extensions**

Provides the flexibility to build complex KPI calculation logic that are specific to the customer and integrates with DMC to be aggregated at various levels of the enterprise hierarchy and visualized in DMC-Dashboard Designer.

Personas:

- Software Developer
- Business Consultant

**Machine Learning Extensions**

Bring you own ML model trained on any ML service/tool and deploy it with DMC and integrate it to the business & manufacturing processes without a line of code.

The ML model can be trained with common ML services/tools but needs to be exported or converted into TensorFlow JavaScript ML model binary files. Please check release notes for further updates on supported ML formats.

Personas:

- Business User
- Citizen Data Scientist

![](docs/assets/indexLectureSlide31.png)

## Note
Our recommended extensibility platform for DMC is Kyma, however, it can be use case specific which may lead into different recommendations. Please know that DMC extensions can also be done with Cloud Foundry using a PaaS environment (or hyperscaler options which have not been fully explored).  The main difference picking between these two options, outside of our recommendation, is the lifecycle and costs. Kyma takes care of the lifecycle, scalability, monitoring, deployment, etc. of the extensions but is more expensive while Cloud Foundry/PaaS will have lower upfront costs but can be costly in terms of complexity, time, etc. to implement lifecycle management separately.

## Real World Customer Examples
![](docs/assets/indexLectureSlide33.png)
![](docs/assets/indexLectureSlide34.png)

Each extension area has a folder in which you can find different sample code according to scenario and to the implementation technology used.

For more information, please check the readme files in the different folders.

## Scenario Overview

| Category      | Scenario      | Overview      | Link          |
| ------------- | ------------- | ------------- | ------------- |
| Business Process Extension | Get Custom Fields from Order Data | In this example we demonstrate how to retrieve order-specific custom data depending on the current material (SFC) that is being worked on. This data can then be passed to external systems to trigger additional processes or to validate that certain conditions are met. | [Get-Custom-Fields-From-Order-Data-Using-SFC](DMC_BusinessProcesses/1-Get-Custom-Fields-From-Order-Data-Using-SFC)  |
UI Extension | Custom Plugin for DMC PODs  | This custom plugin provides the sample implementation of a generic button which can be used in the POD Designer. When the user clicks the button in the POD, a URL will be called and parameters can be passed to the target application. | [Custom-Plugin-for-DMC-PODs](DMC_UX/1-Create-a-Generic-Button-And-Register-As-Custom-PoD-Plugin/CustomPodPlugin)  |

# SAP Manufacturing Execution Extension Samples
SAP Manufacturing Execution (SAP ME) is a powerful, enterprise-level, scalable, manufacturing business solution that enables global manufacturers to manage and control manufacturing and shop floor operations.<br />
With the new release of SAP ME 15.4, all the PAPIs are exposed as REST API’s which enables SAPUI5 based extensions of Production Operator Dashboards (POD) without SAP ME Software Development Kit (SDK).<br />
Using the sample extensions provided will allow you to learn and understand how to build your SAPUI5 based extensions of Production Operator Dashboards to use with SAP ME.
## Description

![](docs/assets/images/me_ext_pod.png)

Link: [SAP ME UI5 Extension POD](ME_POD)

## How to obtain support
If you have issues with a sample, please open a report using [GitHub issues](../../issues).

## License
Copyright © 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, v2.0 except as noted otherwise in the  [LICENSE](LICENSES/Apache-2.0.txt).
