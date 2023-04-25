sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";

  var apiUrl;

  return {

    getEmptyOrder: function () {
      return new JSONModel({ userId: "", description: "" });
    },

    getOrders: async function () {
      return sendRequest("/api/v1/users", {
        method: "GET",
      });
    },

    addOrder: async function (data) {
      console.log(JSON.stringify(data));
      return sendRequest("/api/v1/user/add", {
        body: JSON.stringify(data),
        method: "POST",
      });
    },

    updateOrder: async function (data) {
      return sendRequest("/api/v1/user/update", {
        body: JSON.stringify(data),
        method: "POST",
      });
    },

    deleteOrder: async function (userId) {
      return sendRequest("/api/v1/user/delete/" + userId, {
        method: "POST",
      });
    },
  };

  async function sendRequest(path, opts = {}) {
    const headers = Object.assign({}, opts.headers || {}, {
      "Content-type": "application/json; charset=UTF-8",
    });

    const response = await fetch(
      getAPIURL() + path,
      Object.assign({ method: "POST", credentials: "same-origin" }, opts, { headers })
    );

    const data = await response.json();

    if (response.status !== 200 || data.error) {
      console.log(data.error);
      throw new Error(`${response.status} Message: ${data.message}`);
    }

    return data;
  }

  function getAPIURL() {
    if (apiUrl === undefined) {
      var oModel = new JSONModel({});
      var configUrl = jQuery.sap.getModulePath("kyma.sample.app", "/config.json");
      oModel.loadData(configUrl, "", false);
      apiUrl = oModel.getProperty("/API_URL");
      console.log(apiUrl);
      apiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    }

    return apiUrl;
  }
});
