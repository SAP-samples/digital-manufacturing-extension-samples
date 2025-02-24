sap.ui.define([
	"sap/dm/dme/podfoundation/controller/PluginViewController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel"
], function (PluginViewController, JSONModel, ODataModel) {
	"use strict";

	return PluginViewController.extend("cap.custom.plugins.customplugin.plugin1.controller.MainView", {
		onInit: function () {
			PluginViewController.prototype.onInit.apply(this, arguments);   
		},

        onBeforeRenderingPlugin: function () {

			let oDataModel = new ODataModel({
                "serviceUrl" : "https://" + window.location.host + "/destination/srv-api/odata/v4/events/",
				"operationMode" : "Server",
				"groupId": "$direct",
				"synchronizationMode": "None",
				"odataVersion": "4.0"
            });

            this.getView().setModel(oDataModel);


			// Loading data from Remote REST APIs via the CAP service and remote destination
			let jsonModel = new JSONModel();
			jsonModel.loadData("https://" + window.location.host + "/destination/srv-api/odata/v4/remote-rest/getOrders(Plant='VP100',fromDate=2024-01-28T00:00:00.000Z,toDate=2024-07-28T00:00:00.000Z)");
		},

        onAfterRendering: function(){
           
        },
        
		onExit: function () {
			PluginViewController.prototype.onExit.apply(this, arguments);
		}
	});
});