'use strict';
const axios = require('axios');
const qs = require('qs');

const params =
  {
    "baseUrl": process.env.baseUrl,
    "plant": process.env.plant,
    "order": process.env.order
  };

const auth_config =
{
  "url": process.env.url,
  "clientid": process.env.clientid,
  "clientsecret": process.env.clientsecret,
  "grant_type": process.env.grant_type
};

const SYS_URL = params.baseUrl;

const URL = {
  getOrderDetail: SYS_URL + "/order/v1/orders"
};

let params_plant = params.plant;
let params_order = params.order;

const authService = {
    getOauthToken: async function () {
        const AUTHORIZATION = 'Basic ' + Buffer.from(auth_config.clientid + ':' + auth_config.clientsecret).toString('base64');
        const response = await axios.post(auth_config.url, qs.stringify({
            clientid: auth_config.clientid,
            grant_type: auth_config.grant_type
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': AUTHORIZATION
            }
        });
        return response.data;
    }
};

const httpService = {
    get: async function (url) {
        const tokenResult = await authService.getOauthToken();
        console.log("AUTHTOKEN - GET SUCCESSFUL");
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokenResult.access_token
            }
        });
        return response.data;
    }
};

const dmcService = {
    getOrderDetail: function (plant, order) {
        const url = URL.getOrderDetail + "?order=" + order + "&plant=" + plant;
        console.log("URL ---" + url);
        return httpService.get(url);
    }
};


module.exports = {
  main: function (event, context) {

    let plantValue,
        orderValue,
        orderdetails,
        identifiers,
        finalresult = {};


    if (event.data !== undefined) {

      console.log("Input parameters: " + JSON.stringify(event.data));

      identifiers = event.data.identifiers;
      console.log("old SFC identifiers: " + identifiers);

      orderValue = event.data.extensionParameters.ORDER_NAME;
      plantValue = event.data.extensionParameters.PLANT;
      console.log("Order Value: " + orderValue);
      console.log("Plant Value: " + plantValue);
      finalresult = event.data;

    } else {
      orderValue = params_order;
      plantValue = params_plant;
    }

    return new Promise((resolve, reject) => {
      dmcService.getOrderDetail(plantValue, orderValue).then((result) => {

        orderdetails = typeof result === 'string' ? JSON.parse(result) : result;

        let customdata;

        for (let i = 0; i < orderdetails.customValues.length; i++) {
          if (orderdetails.customValues[i].attribute == "CD_SALES_ORDER_ID") {
            customdata = orderdetails.customValues[i].value;
          }
        }
        console.log("Sales Order: " + customdata);

        let array = [];
        let newSeq;
        for (let iter = 0; iter < identifiers.length; iter++) {
          newSeq = customdata + identifiers[iter].substring(identifiers[iter].length - 4, identifiers[iter].length);
          console.log("new SFC identifiers: " + newSeq);
          array.push(newSeq);
        }

        finalresult.identifiers = array;
        resolve(finalresult);

      }).catch((err) => {
        reject(err);
      });
    });

  }
};
