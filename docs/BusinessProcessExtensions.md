# Unit 4 - Business Process Extensions

## Overview

<!--An extension that will be called from the DMC Shop Floor Designer (SFD) process flow that will be executed in the DMC Process Engine (PE) (e.g. extension could trigger a parallel process in an external system, augment the core process flow,…etc.).  Provides flexibility to adapt processes within and outside DMC.-->

A business process extension service is a reusable function which can assist in data formatting, data enrichment, or other use cases for shop floor design. It can be written in either serverless Functions in SAP BTP, Kyma Runtime, or in any kind of API exposure from SAP BTP(Kyma Runtime or Cloud Foundary Runtime). Furthermore, it can also be written in a business application within a customer landscape exposed as an API and registered in SAP Digital Manufacturing Cloud.

## Learning objectives

- Understand how to build business process extensions and extend the Production Process with your own business process extensions in SAP DMC Shop Floor Designer.


## BTP Components
- You can build your own extension either using Kyma or Cloud Foundry runtime of BTP.


## Architectural Overview
The architecture in the following diagram shows different components from SAP and the customer landscape coming together to create distinct patterns for building extensions.

The following patterns are possible:

1. Extend with services from severless Functions in SAP BTP, Kyma Runtime.
2. Extend with services from customer-built applications in SAP BTP (Kyma Runtime or Cloud Foundary Runtime).
3. Extend with services from customer’s own application (Cloud or On Premise) out of SAP BTP.
4. Extend with services published by partners built on SAP BTP, and customers can subscribe and use them in Shop Floor Designer.
5. Extend with services from other SAP systems, e.g. SAP S/4HANA, ME/MII or SAP EWM, etc. 
 

![](assets/processExtensions_architecture.png)


