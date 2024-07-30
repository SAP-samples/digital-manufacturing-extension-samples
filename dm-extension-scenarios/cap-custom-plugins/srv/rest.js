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
