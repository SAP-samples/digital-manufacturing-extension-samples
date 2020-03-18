'use strict';
const request = require("request");
const auth_config = require("./sysAuthCfg");
const params = require("./sampleValues");

let params_plant = params.plant;
let params_sfc = params.sfc;

const SYS_URL = params.baseUrl;

const URL = {
  getSFCDetail : SYS_URL + "/sfc/v1/sfcdetail",
  getOrderDetail: SYS_URL + "/order/v1/orders"
};

const authService = {
    getOauthToken : function(){
        const AUTHORIZATION = 'Basic ' + Buffer.from(auth_config.clientid + ':' + auth_config.clientsecret).toString('base64');
        let formData = {
          clientid : auth_config.clientid,
          grant_type : auth_config.grant_type
        };
        return new Promise((resolve , reject)=>{
          request.post({
            url : auth_config.url ,
            headers : {
              "Content-Type" : "application/x-www-form-urlencoded",
              "Authorization" : AUTHORIZATION
            },
            form : formData
          },(err,httpResponse,body)=>{
            if(err){
              reject(err);
              return ;
            }
            resolve(JSON.parse(body));
          });
        });
    }
}

const httpService = {
    get : function(options , callback){
      authService.getOauthToken().then((result)=>{
          
        console.log("AUTHTOKEN - GET SUCCESSFUL");
        options = Object.assign({},{ 
          headers : {
          "Content-Type": "application/json",
          "Authorization": "Bearer " +  result.access_token
          }},options);
          request.get(options , callback);
      });
    }
}


const dmcService = {
  getSFCDetail : function(plant,sfc){
    return new Promise( (resolve , reject)=>{
        
      httpService.get({
        url : URL.getSFCDetail + "?plant="+ plant +"&sfc=" + sfc
      },(err , httpResponse , body)=>{
        if(err){
          reject(err);
          return ;
        }
        resolve(body);
      });
    });
  },
  getOrderDetail : function(plant,order){
    return new Promise( (resolve , reject)=>{
      httpService.get({
        url : URL.getOrderDetail + "?order=" + order + "&plant=" + plant
      },(err , httpResponse , body)=>{
        if(err){
          reject(err);
          return ;
        }
        resolve(body);
      });
    });
  }
}


module.exports = { 
	handler: function (event, context) { 

	    // Let sfcparam and plantparam be a parameter registered for this FaaS in Manage Service Regsistry
	    let sfcValue, 
	        plantValue,
	        orderValue,
	        sfcdetails,
	        requests,
	        finalOutput,
	        orderdetails;
	
        if(event.data.sfcparam !== undefined){
            sfcValue = event.data.sfcparam;
            plantValue = event.data.plantparam;
        }
        else{
            sfcValue = params_sfc;
            plantValue = params_plant;
        }
        
        return new Promise((resolve , reject)=>{
             dmcService.getSFCDetail(plantValue, sfcValue).then((result)=>{

                sfcdetails =  JSON.parse(result);
                orderValue = sfcdetails.order.order;
               
                requests = [dmcService.getOrderDetail(plantValue, orderValue)];
                finalOutput = {
                    sfc: sfcdetails.sfc,
                    order: sfcdetails.order.order
                };
                
                Promise.all(requests).then(responses => {
                    orderdetails = JSON.parse(responses[0]);
                    
                    finalOutput.orderCustomValues = orderdetails.customValues;
                    resolve(finalOutput);
                })
                
             }).catch((err)=>{
                 reject(err);
             });
        });
	  } 
 }