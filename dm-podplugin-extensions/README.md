# Description

Currently POD Plugins can be deployed in 
* Hosted directly on DM SaaS account
* Hosted on BTP PaaS account

The examples under folder **/CustomPodPluginExamples** can be deployed directly in DM. For getting started, download the repository and compress contents of the folder into a zip file and the upload to POD Designer. **While compressing into a zip folder, the root should be "/".**
 


The examples under folder **/ExecutionPodPluginTemplate_and_Example** and **/ViewPodPluginTemplate_And_Example** can be deployed in BTP. The deployment and configuration steps are captured inside the documentation folder in them. 


# Code Snippets


Common Scenarios  | Sample Code Snippet 
----------------- | --------------------
Get User Id | ` this.getPodController().getUserId() `
Get User Plant |  ` this.getPodController().getUserPlant() ` 
Calling DM Public APIs | ` this.getPublicApiRestDataSourceUri() + '<Relative Path>' ` 
Calling DM Production Process REST Endpoint | ` this.getPublicApiRestDataSourceUri() + '/pe/api/v1/process/processDefinitions/start?key=<>&async=<>' `
Get i18n Label | ` this.getI18nText(<i18nKey>) `
Publish Event | ` this.publish("WorklistRefreshEvent", { "source": this, "order": <selectedOrder>, "forceSelection": true, "sendToAllPages": true}) `


