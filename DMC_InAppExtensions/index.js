'use strict';
const request = require("request");

const params =
  {
    "baseUrl": process.env.baseUrl,
    "plant": process.env.plant,
    "order": process.env.order
  }

const auth_config = 
{
  "url": process.env.url,
  "clientid": process.env.clientid,
  "clientsecret": process.env.clientsecret,
  "grant_type": process.env.grant_type
}

const SYS_URL = params.baseUrl;

const URL = {
  getOrderDetail: SYS_URL + "/order/v1/orders"
};

let params_plant = params.plant;
let params_order = params.order;
 
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
  getOrderDetail : function(plant,order){
    return new Promise( (resolve , reject)=>{
      console.log("URL ---" + URL.getOrderDetail + "?order=" + order + "&plant=" + plant);
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
  main: function (event, context) {

    let plantValue,
        orderValue,
        orderdetails,
        identifiers,
        finalresult = {};

               
    if(event.data !== undefined){
            
      console.log("Input parameters: " + JSON.stringify(event.data));  

      identifiers = event.data.identifiers;

      let stringArray = event.data.identifiers[0].substring(0,identifiers[0].length-4).split('-');
      orderValue = stringArray[0];
      plantValue = stringArray[1];
      console.log("Order Value: " + orderValue);
      console.log("Plant Value: " + plantValue);
      finalresult = event.data;

    }
    else{
      orderValue = params_order;
      plantValue = params_plant;
    }

    return new Promise((resolve , reject)=>{
      dmcService.getOrderDetail(plantValue, orderValue).then((result)=>{
 
        //console.log(result);
        orderdetails =  JSON.parse(result);
        
        let customdata;
        
        for (let i=0; i < orderdetails.customValues.length; i++) {
          if (orderdetails.customValues[i].attribute == "CD_SALES_ORDER_ID"){
            customdata = orderdetails.customValues[i].value;
          }
        }
        console.log(customdata);

        let array = [];
        let newSeq;
        for (let iter=0; iter < identifiers.length; iter++) {
          newSeq = customdata + identifiers[iter].substring(identifiers[iter].length-4,identifiers[iter].length);
          console.log("newSeq: " + newSeq);
          array.push(newSeq);
        }

        finalresult.identifiers = array;
        resolve(finalresult);

      }).catch((err)=>{
        reject(err);
      });
    });

  }
}