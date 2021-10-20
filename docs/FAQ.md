# Frequently Asked Questions

### Can we do extensions in DMC with demo and test licence we have as partner
Yes you can and you can start testing the concepts of DMC Extensibility building artifacts in BTP trial account.

### Can you show us what kind of tables are exposed from DMC via OData services? 
DMC does not expose the tables rather data is exposed via public REST APIs. Here is a list DMC APIs exposed and documented in [SAP API Hub](https://api.sap.com/package/SAPDigitalManufacturingCloud/rest)

### What kind of In-App extensions are possible withing DMC?
There are whole range of possibilities with In-App Extensions such as extend existing APIs, trigger parallel processes, augment API outputs, custom Fields support and enriching integration content listening to stanard events. The activity hook can be a pre or post event. 

### Is it theoretically possible to customize a POD button to open a link with a dynamic parameter that is filled with the currently selected shop order?
Yes, it is possible with a custom POD Plugin. 

### How can we migrate the activity hooks and how can we interact with external databases or systems (MII, external services) as we do with the hooks?
This would be similar to how to tackle some of the In-App extension scenarios and interaction with external databases can happen in production process deisgner using APIs. Also, there is further work in progress in this area to make it more usable. 

### What is the alternate solution for MII and can we keep using the same.
We dont have direct replacement for MII. And absolutely, we can reuse the services from MII along with the new capabilities in Production Process Designer to orchestrate some of the business logic needed for custom processes and extensions.

### Where can we put our own implemented web services?
Custom API/webservices can be deployed in PaaS account or in Kyma environment and can be linked to production process deisgner. We have some demos around this in the bootcamp event. 

Also, the service enhancements done at the shop floor such as Printing enhancements, Shop-order creation, SFC lifecycle checking, Customized ME-ERP backflushing, Scrap extension etc. can be addressed using the extensive array of extensibility mechanisms in DMC. Some of the conversation would be realized in the bootcamp excercises. 

### Where can we create our own schema and how can access it from DMC?
Customers/partners can have their own schema to store the custom objects/data in PaaS account or Kyma environment. We have some demo also on the bootcamp event.  

### How we can refresh POD from Machine Connectivity trigger?
We can subscribe to machine tags and refresh POD by sending notifications events.

### Can we show notifications on POD as per the changes in tag vaue changes?
Yes, this can be done using the POD Messages or customers and partners can write POD plugins which can listen for the notification event. 

### Is it correct to say SAP ME Java SDK knowledge is obsolete in SAP DMC or is there any Java involved?
The extensions built in DMC can be microservices bringing the whole notion of persistence, service and UI. And building microservice in the cloud is language agnostic, so definitely the knowledge and design patterns can be repurposed here. 

### For the Machine Learning piece, data is critical. Do we have the ability to do SDI or some kind of SLT tool, for extracting high volume of information? 
This work is in requirment phase followed by the design phase.

### How can we create/extend our own PODs? 
We can create custom PODs using standard plugins through configuration or through building new custom POD plugins. The custom plugins can be built in PaaS environment or in Kyma.

### Is there a guideline how to migrate existing SAP ME HTML plug-ins to DMC?
Currently there are no guidelines to migrate ME POD plugins to DMC, but we are currently evaluating the feasibility.

### How is the transport between different systems (development, test, productive) managed?
You can find the description here: [Cloud Transport Management](https://discovery-center.cloud.sap/serviceCatalog/cloud-transport-management?region=all)



