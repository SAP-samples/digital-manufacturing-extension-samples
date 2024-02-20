sap.ui.define([
    'jquery.sap.global',
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/m/MessageBox",
], function (jQuery, PluginViewController, MessageBox) {
    "use strict";
    return PluginViewController.extend("com.custom.plugins.scanassembly.statusapp.controller.MainView", {
        onInit: function () {
            PluginViewController.prototype.onInit.apply(this, arguments);
        },

        onBeforeRenderingPlugin: function () {
            this.subscribe("UpdateAssemblyStatusEvent", this.handleAssemblyStatusEvent, this);
            this.subscribe("WorklistSelectEvent", this.handleWorklistSelectEvent, this);
            var oView = this.getView();
            if (!oView) {
                return;
            }
        },

        handleAssemblyStatusEvent: function (s, E, oData) {
            this.getView().byId("componentValue").setText(oData.scanInput);
            this.getView().byId("statusButton").setText(oData.status);
            this.getView().byId("statusButton").setType(oData.type);
            this.getView().byId("messageValue").setText(oData.message);
        },

        handleWorklistSelectEvent: function (s, E, oData) {
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }
            MessageBox.information("Number of SFC selected - " + oData.selections.length);
        },

        getCustomNotificationEvents: function () {
            //needed for custom event subscribe
            return ["SCREW_DRIVER_STATUS", "PP_ACTION"];
        }, 
        
        isSubscribingToNotifications: function () {
            //needed for custom event subscribe
            return true;
        }, 
        
        getNotificationMessageHandler: function (sTopic) {
            //needed for custom event subscribe
            if (sTopic === "SCREW_DRIVER_STATUS") {
                return this.handleScrewDriverReady;
            }

            if (sTopic === "PP_ACTION") {
                return this.handlePPAction;
            }
        },
        
        handleScrewDriverReady: function (oEvent) {
                let oScrewDriverStatus = oEvent.parameters[0].value;
                let oScrewDriverMessage = oEvent.parameters[1].value;
                this.getView().byId("driverStatusButton").setText(oScrewDriverStatus);
                this.getView().byId("driverStatusButton").setType(oScrewDriverStatus == "READY" ? "Success" : "Negative");
                this.getView().byId("driverMessageValue").setText(oScrewDriverMessage);
        },

        handlePPAction: function (oEvent) {
            MessageBox.information(oEvent.message);
        },

        fetchMachineStatus: function(){
			var requestJSON = {
				"InPlant": this.getPodController().getUserPlant(),
				"InOperation": this.getPodSelectionModel().operations[0].operation,
				"InResource": this.getPodSelectionModel().resource.resource,
			};

			var url = this.getPodController()._oPodController.getPublicApiRestDataSourceUri() +
				"pe/api/v1/process/processDefinitions/start?key=REG_551bcc9d-7b1d-4c3c-ac23-97c5b8fc06f5";
			var that = this;
			this.getPodController()._oPodController.ajaxPostRequest(url, requestJSON,
				function(oResponseData) {
					console.log(oResponseData);
				},
				function(oError, sHttpErrorMessage) {
					var err = oError || sHttpErrorMessage;
					console.log(err);
				}
			);            
        },

        onExit: function () {         
            PluginViewController.prototype.onExit.apply(this, arguments);
            this.unsubscribe("UpdateAssemblyStatusEvent", {}, this);
            this.unsubscribe("WorklistSelectEvent", {}, this);
        }
    });
});