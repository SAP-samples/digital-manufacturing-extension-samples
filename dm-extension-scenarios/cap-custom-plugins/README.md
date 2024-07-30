# Description
This is a sample code for full-stack CAP based custom pod plugin along with in-app custom tables exposed as OData v4 services. 

# Scenario 1: Fetching data from local DB

DB definition schema.cds

```
entity CustomTable {
  sfc             : String(40);
  order           : String(40);
  customField1    : String(40);
  customField2    : String(40);
}
```

Service definition in service.cds

```
using { dm.custom.schema as schema} from '../db/schema';

service EventsService {
  entity CustomEntitySet as projection on schema.CustomTable;
}
```

Model Instantiation and binding in MainView.controller.js
```
let oDataModel = new ODataModel({
    "serviceUrl" : sap.ui.require.toUrl('cap/custom/plugins/customplugin') + '/../srv/odata/v4/events/',
	"operationMode" : "Server",
	"groupId": "$direct",
	"synchronizationMode": "None",
	"odataVersion": "4.0"
});

this.getView().setModel(oDataModel);
```

Consumption in MainView.view.xml
```
<Table class="sapUiSmallMargin"								
	growing="true" 
	growingThreshold="10"
	inset="false"
	width="auto"
	items="{
	    path: '/CustomEntitySet',
		sorter: [{
			path: 'order', 
			descending: false
		}],
		parameters: {
			$count: true,
			$$updateGroupId : 'updateGroup1'
		}
}">																
```

![](./readmeReferences/image/DataFromLocalDB.png)


# Scenario 2: Fetching data from Remote protected destination calls

Destination to REST endpoint
![](./readmeReferences/image/RemoteAPIDestination.png)

Instrumenting in package.json

```
"cds": {
    "requires": {
      "[production]": {
        ...
        "DMC_Cloud_API": {
          "kind": "rest",
          "credentials": {
            "destination": "DMC_Cloud_API",
            "requestTimeout": 30000
          }
        }
      }
    }
  }
```

Create endpoint in rest.cds

```
service RemoteRestService {

    function getOrders(Plant: String, fromDate: DateTime, toDate: DateTime) returns array of {

        PLANT: String;
        MFG_ORDER: String;
        MATERIAL: String;
        SCHEDULED_START: DateTime;
        ACTUAL_START: DateTime;

    };

}
```

Writing login in rest.js

```
class RemoteRestService extends cds.ApplicationService {
    init(){
        this.on('getOrders', async (req) =>{
            const restApi = await cds.connect.to("DMC_Cloud_API") //should match the connection name in step 1
            let sBaseUrl = "/dmci/v4/extractor";
            let sUrl = sBaseUrl + "/ORDER?$filter=PLANT eq '" + req.data.Plant + "' and SCHEDULED_START gt " + req.data.fromDate + " and SCHEDULED_START lt " + req.data.toDate + " and ACTUAL_START eq null&$select=PLANT,MATERIAL,MFG_ORDER,SCHEDULED_START,ACTUAL_START";
            console.log(sUrl);
            let res =  restApi.tx(req).get(sUrl);
            let final_data = res.then( async (data) => {
                console.log(data);
                return data.value;
            });    
            return final_data;
        });
    }
}

module.exports = {RemoteRestService}
```

Calling from Custom Plugin in MainView.controller.js

```
let jsonModel = new JSONModel();
jsonModel.loadData(sap.ui.require.toUrl('cap/custom/plugins/customplugin') + "/../srv/odata/v4/remote-rest/getOrders(Plant='VP100',fromDate=2024-01-28T00:00:00.000Z,toDate=2024-07-28T00:00:00.000Z)")

```

![](./readmeReferences/image/RemoteAPITEst.png)

