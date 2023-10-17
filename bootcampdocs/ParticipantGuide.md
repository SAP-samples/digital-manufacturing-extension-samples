# SAP DM Extensibility Bootcamp

## Notice
* Participants should come to the bootcamp with their **own DM Demo system**.
* All the exercises will be performed withinin participants' own BTP trial accounts. To get started, please follow [the tutorial](https://developers.sap.com/tutorials/hcp-create-trial-account.html).
* Follow the **Prerequisite** section to install the necessary dev tools before bootcamp starts.
* Participants should have preliminary technical knowledge on **Node.js, SAPUI5 and SAP Business Technology Platform**.

## Prerequisite

Required:
- `git` ([Git Downloads](https://git-scm.com/downloads))
- A source code editor ([Visual Studio Code](https://code.visualstudio.com/) is recommended)
- `bash` or `zsh` shell to run the command snippets on MacOS or Linux, or [Git Bash](https://gitforwindows.org/) for Windows, MinGW, or [Cygwin](https://www.cygwin.com/)
- `kubectl` ([Kubernetes Command Line tool](https://kubernetes.io/docs/tasks/tools/)), see this tutorial how to install it
Nice-to-have:
- `docker` (for example, [Docker Desktop](https://www.docker.com/products/docker-desktop) for macOS or Windows)
- `node` ([Node.js](https://nodejs.org/en/download/) version 12.x or 14.x is recommended)
-  `SAP Fiori Tools` [https://www.npmjs.com/package/@sap/generator-fiori](https://www.npmjs.com/package/@sap/generator-fiori)
- `cf` ([Cloud Foundry Command Line Interface (CLI)](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html))
- `mta` ([Multitarget application interface](https://sap.github.io/cloud-mta-build-tool/download/))
- Download [postman tool](https://www.postman.com/downloads/)


## Step 1 - Configure your Trial Account

1. Go to [SAP BTP Cockpit](https://cockpit.eu10.hana.ondemand.com/trial/#/home/trial).
2. Choose **Go To Your Trial Account**.
    - If you don't have an existing user, you need to [register](https://developers.sap.com/tutorials/hcp-create-trial-account.html) for a free.
3. Redirect to the **Subaccounts** page of your **Global Account** on trial.
4. Choose the subaccount named **trial**.
5. From the **Navigation area**, choose Security **Trust Configuration**.
6. Select the default IdP by clicking on the name attribute. The name might be **SAP ID Service** or **Default Identity provider**.
7. Enter the e-mail of the user to whom you want to give permissions.
8. Click **Show Assignments**.
9. Click **Assign Role Collection**.
10. From the Assign Role Collection dropdown list, select the relevant role collection:
    - Select **Business_Application_Studio_Developer** to assign a role collection to a developer.
    - Select **Business_Application_Studio_Administrator** to assign a role collection to an administrator.
    - Select **Business_Application_Studio_Extension_Deployer** to assign a role collection to an extension developer.

## Step 2 - Enable Kyma in Trial Account

1. Go to [SAP BTP Cockpit](https://cockpit.eu10.hana.ondemand.com/trial/#/home/trial).
2. Choose **Go To Your Trial Account**.
3. You should land on the **Subaccounts** page of your **Global Account** on trial.
4. Choose **trial**.
5. Go to **Kyma Environment**.
6. Choose **Enable Kyma**.
7. Provide a **Cluster Name**.
8. Choose **Create**.

**Note**: 
* Enabling Kyma environment will take some time. For trial accounts, Kyma has a limitation expiration dates of 14 days. 
* Please enable the Kyma environment 1 day before the start to ensure the availability of which during the bootcamp period.

## Step 3 - Assign Kyma Roles to User

In BTP trial account, you will become the tenant admin after enabling Kyma. There's no need to assign cluster roles to your user for bootcamp purpose. In the future, please follow the steps to [assign Roles in the Kyma Environment](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/148ae38b7d6f4e61bbb696bbfb3996b2.html) if needed.

## Step 4 - Getting started with Business Application Studio

SAP Business Application Studio is a development environment available on SAP Business Technology Platform. To get started, please follow [the link](https://developers.sap.com/tutorials/appstudio-onboarding.html).

1. Go to [SAP BTP Cockpit](https://cockpit.eu10.hana.ondemand.com/trial/#/home/trial).
2. Launch **SAP Business Application Studio** and a new tab will open.
3. Click **Create Dev Space** button to create the dev space, and give it a name e.g. **DMExtension**.
4. Choose **Full-Stack Cloud Application** as the application type and finsh the creation.
5. The status will change from **STARTING** to **RUNNING** if the dev space is successfully created.

## [SAP Team] Step 5 - Load DM Demo Data
In this step, we plan to load the master data which will be used in bootcamp excercise by using automation tools. To achieve this, we will need information from service key of your digital manufacturing instance.

Please refer to [Prepare for API Integration - Create service key](https://help.sap.com/viewer/34f67db3b755405e8145c578221f012c/latest/en-US/29d18581dab1438c92a79f28adcc8142.html#loio29d18581dab1438c92a79f28adcc8142__subsection-im5) for generating the service key. 

## [SAP Team] Step 6 - Register a POD via Postman

In this step, we will use API to onboard POD template into DM tenant, e.g. **DMC_PARTNER_POD**.

After you find the newly registered POD in **POD Designer app**, you can enter into this POD and publish it so that you will be able to find it on Home page under the group **Manufacturing Execution** as a tile, or search it by its name. 

See [SAP Help Portal | Publishing a POD as a Tile](https://help.sap.com/docs/sap-digital-manufacturing/execution/publishing-pod-as-tile) for detailed information.

## Step 7 - Add All Work Center under Your Assignment
Go to **Manage User Assignments** app to add yourself as a member of all work centers.

## [Optional] Step 8 - Install SAP Plant Connectivity
With SAP Plant Connectivity (PCo), SAP provides a software component that enables the exchange of data between an SAP system and the industry-specific standard data sources of different manufacturers, for example, process control systems, plant Historian systems, and SPC systems.

Please refer to [SAP Plant Connectivity](https://help.sap.com/viewer/c90214be0d934ebdb6f3bce29c63c0ff/15.5.0/en-US/46a00344d44852b7e10000000a155369.html?q=plant%20connectivity) for more details.

## [Optional] Step 9 - Install SAP Cloud Connector
Configure a cloud connector that acts as a reverse invoke proxy between an on-premises network and SAP Business Technology Platform. The cloud connector comes standard as part of the SAP Cloud Integration service and serves as a link between SAP Business Technology Platform and on-premise systems such as SAP S/4HANA.

Please refer to [Setting Up the Cloud Connector](https://help.sap.com/viewer/c86ca4026fae4cb3ba66ed751866175b/latest/en-US/ef206b74c1dd416caf1e0fa555a2441f.html#c89cabe21cee42b2be3380bb887a9c3a.html) for more details.

## [Optional] Step 10 - Configure Machine Model in DMC
SAP Plant Connectivity is the connectivity layer between SAP Digital Manufacturing Cloud and the shop floor. As SAP Plant Connectivity is installed on the customer's premises, a cloud connector is required for the communication from SAP Digital Manufacturing to SAP Plant Connectivity. In addition, the communication needs to be secured by valid certificates.

Please refer to [Integrate with SAP Plant Connectivity](https://help.sap.com/viewer/c86ca4026fae4cb3ba66ed751866175b/latest/en-US/2aaac1f5ed104ffb850ede5942d7031d.html?q=plant%20connectivity) for more details.

## [Optional] Step 11 - Integration with SAP ERP or SAP S/4HANA
SAP Digital Manufacturing for execution uses SAP Cloud Integration to communicate with external SAP ERP or SAP S/4HANA systems. You can connect various ERP systems, for example one system per plant or country. The global SAP Digital Manufacturing for execution system is used across all plants.

Please refer to [Integration with SAP ERP or SAP S/4HANA](https://help.sap.com/viewer/c86ca4026fae4cb3ba66ed751866175b/latest/en-US/351c4ef7bb4c4c4a8d7f9562988575c5.html) for more details.

## BTP Services for DM Extensions
* SAP Business Application Studio

    SAP Business Application Studio is a development environment available on SAP Business Technology Platform. Follow this link for more details [https://discovery-center.cloud.sap/serviceCatalog/business-application-studio?region=all](https://discovery-center.cloud.sap/serviceCatalog/business-application-studio?region=all).

* Kyma Runtime

    SAP BTP, Kyma runtime is a fully managed Kubernetes runtime based on the open-source project "Kyma". This cloud-native solution allows the developers to extend SAP solutions with serverless Functions and combine them with containerized microservices. The offered functionality ensures smooth consumption of SAP and non-SAP applications, running workloads in a highly scalable environment, and building event- and API-based extensions. Follow this link for more details [https://discovery-center.cloud.sap/missiondetail/3252/3281/](https://discovery-center.cloud.sap/missiondetail/3252/3281/).
    
* Cloud Foundary Runtime

    The SAP BTP, Cloud Foundry runtime lets you develop polyglot cloud-native applications and run them on the SAP BTP Cloud Foundry environment. Follow this link for more details [https://discovery-center.cloud.sap/serviceCatalog/cloud-foundry-runtime?region=all](https://discovery-center.cloud.sap/serviceCatalog/cloud-foundry-runtime?region=all).

* HTML5 Application Repository

    The HTML5 Application Repository service for SAP BTP enables central storage of HTML5 applications on SAP BTP. The service allows application developers to manage the lifecycle of their HTML5 applications. In runtime, the service enables the consuming application, typically the application router, to access HTML5 application static content in a secure and efficient manner. Follow this link for more details [https://discovery-center.cloud.sap/serviceCatalog/html5-application-repository-service?region=all](https://discovery-center.cloud.sap/serviceCatalog/html5-application-repository-service?region=all).

* Destination Service 

    The Destination service lets you retrieve the backend destination details you need to configure applications in the Cloud Foundry environment. Follow this link for more details [https://discovery-center.cloud.sap/serviceCatalog/destination?service_plan=lite&region=all](https://discovery-center.cloud.sap/serviceCatalog/destination?service_plan=lite&region=all).

* SAP Integration Suite (CPI)

    SAP Integration Suite connects and contextualizes processes and data while enabling new content-rich applications to be assembled faster with less dependence on IT. Pre-built integration packs along with existing investments can be composed to deliver new outcomes with less involvement by integration experts. Follow this link for more details [https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all](https://discovery-center.cloud.sap/serviceCatalog/integration-suite?region=all).

## References
* DM Extensibility Webinar -Digital Manufacturing Cloud Extensibility Overview - [PDF](https://d.dam.sap.com/a/QAGDuqa) | [Recording](https://wiki.scn.sap.com/wiki/display/SCM/Events+and+Webinars+for+SAP+Digital+Manufacturing+Cloud#:~:text=Extensibility%20Overview%20PDF%20%7C-,Recording,-15%20June%202021)
* SAP Extension Suite Learning Journey - [Build side-by-side extensions on SAP BTP](https://learning.sap.com/learning-journey/build-side-by-side-extensions-on-sap-btp)
* Getting ready for Extensions - [https://blogs.sap.com/2020/04/16/sap-digital-manufacturing-cloud-ready-for-extensions/](https://blogs.sap.com/2020/04/16/sap-digital-manufacturing-cloud-ready-for-extensions/)
* Sample Code - [https://github.com/SAP-samples/digital-manufacturing-extension-samples](https://github.com/SAP-samples/digital-manufacturing-extension-samples)
* DM Business Accelerator Hub - [https://api.sap.com/package/SAPDigitalManufacturingCloud?section=Artifacts ](https://api.sap.com/package/SAPDigitalManufacturingCloud?section=Artifacts)
* DM Integration Extensions 
    - [https://blogs.sap.com/2021/08/24/sap-digital-manufacturing-cloud-integration-extension](https://blogs.sap.com/2021/08/24/sap-digital-manufacturing-cloud-integration-extension) 
    - [https://blogs.sap.com/2020/04/16/sap-digital-manufacturing-cloud-ready-for-extensions](https://blogs.sap.com/2020/04/16/sap-digital-manufacturing-cloud-ready-for-extensions)
* Integrating MS Teams - [https://blogs.sap.com/2021/09/17/integrating-microsoft-teams-with-sap-digital-manufacturing-cloud](https://blogs.sap.com/2021/09/17/integrating-microsoft-teams-with-sap-digital-manufacturing-cloud)
* AI/ML Solution for Visual Inspection - [https://blogs.sap.com/2020/12/14/ai-ml-solution-for-visual-inspection-overview-how-to-close-the-production-gap-for-machine-learning](https://blogs.sap.com/2020/12/14/ai-ml-solution-for-visual-inspection-overview-how-to-close-the-production-gap-for-machine-learning)
* DM Roadmap Explorer - [https://roadmaps.sap.com/board?PRODUCT=73555000100800001492&range=CURRENT-LAST#Q4%202021](https://roadmaps.sap.com/board?PRODUCT=73555000100800001492&range=CURRENT-LAST#Q4%202021)
* Recording on SAP DM Extensibility Bootcamp System Provisioning Session 5 - https://sapvideoa35699dc5.hana.ondemand.com/?entry_id=1_0txquezd
* Recording on SAP DM Extensibility Bootcamp System Provisioning Session 6 - https://sapvideoa35699dc5.hana.ondemand.com/?entry_id=1_mlgn6xx3
