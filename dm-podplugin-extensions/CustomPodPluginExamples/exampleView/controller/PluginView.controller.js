sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/dm/dme/podfoundation/model/PodType",
], function(JSONModel, PluginViewController, PodType) {
    "use strict";

    var oPluginViewController = PluginViewController.extend("sap.ext.exampleplugins.exampleView.controller.PluginView", {
        metadata : {
            properties: {
            }
        },

        onInit: function() {
            if (PluginViewController.prototype.onInit) {
                PluginViewController.prototype.onInit.apply(this, arguments);
            }
        },

        /**
         * @see PluginViewController.onBeforeRenderingPlugin()
         */
        onBeforeRenderingPlugin: function() {
            this.subscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
            this.subscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
            this.subscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
        },

        onExit: function() {
            if (PluginViewController.prototype.onExit) {
                PluginViewController.prototype.onExit.apply(this, arguments);
            }
            this.unsubscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
            this.unsubscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
            this.unsubscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
        },

        onBeforeRendering: function() {
            this._loadModel();
        },

        onPodSelectionChangeEvent : function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this._loadModel();
        },

        onOperationChangeEvent : function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this._loadModel();
        },

        onWorkListSelectEvent : function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this._loadModel();
        },

        _loadModel: function() {
            var oView = this.getView();

            var oConfiguration = this.getConfiguration();
            var bNotificationsEnabled = true;
            if (oConfiguration && typeof oConfiguration.notificationsEnabled !== "undefined") {
                bNotificationsEnabled = oConfiguration.notificationsEnabled;
            }

            var oPodSelectionModel = this.getPodSelectionModel();
            if (!oPodSelectionModel) {
                oView.setModel(new JSONModel());
                return;
            }
            var sPodType = oPodSelectionModel.getPodType();
            var sResource;
            var oResourceData = oPodSelectionModel.getResource();
            if (oResourceData) {
                sResource = oResourceData.getResource();
            }
            var iSelectionCount = 0;
            var aInputs = [];
            var sInput, sSfc, sItem, sProcessLot, sShopOrder;
            var aSelections = oPodSelectionModel.getSelections();
            if (aSelections && aSelections.length > 0) {
                for (var i = 0; i < aSelections.length; i++) {
                    sInput = aSelections[i].getInput();
                    if (sInput && sInput !== "") {
                        sSfc = "";
                        if (aSelections[i].getSfc()) {
                            sSfc = aSelections[i].getSfc().getSfc();
                        }
                        sItem = "";
                        if (aSelections[i].getItem()) {
                            sItem = aSelections[i].getItem().getItem();
                        }
                        sProcessLot = "";
                        if (aSelections[i].getProcessLot()) {
                            sProcessLot = aSelections[i].getProcessLot().getProcessLot();
                        }
                        sShopOrder = "";
                        if (aSelections[i].getShopOrder()) {
                            sShopOrder = aSelections[i].getShopOrder().getShopOrder();
                        }
                        aInputs[aInputs.length] = {
                            input: sInput,
                            sfc: sSfc,
                            item: sItem,
                            processLot: sProcessLot,
                            shopOrder: sShopOrder
                        };
                    }
                }
                iSelectionCount = aInputs.length;
            }

            var iOperationCount = 0;
            var aOperations = [];
            var sOperation;
            var oOperations = oPodSelectionModel.getOperations();
            if (oOperations && oOperations.length > 0) {
                for (var i = 0; i < oOperations.length; i++) {
                    sOperation = oOperations[i].operation;
                    if (sOperation && sOperation !== "") {
                        aOperations[aOperations.length] = {
                            operation: sOperation,
                            version: oOperations[i].version
                        };
                    }
                }
                iOperationCount = aOperations.length;
            }

            var oModelData = {
                podType: sPodType,
                inputType: oPodSelectionModel.getInputType(),
                workCenter: oPodSelectionModel.getWorkCenter(),
                operation: "",
                quantity: oPodSelectionModel.getQuantity(),
                resource: sResource,
                selectionCount: iSelectionCount,
                operationCount: iOperationCount,
                Selections: aInputs,
                Operations: aOperations,
                notificationsEnabled: bNotificationsEnabled,
                notificationMessage: ""
            };

            if (sPodType === PodType.Operation && aOperations.length === 1) {
                oModelData.operation = aOperations[0].operation;
            }

            var oModel = new JSONModel(oModelData);

            oView.setModel(oModel);
        },

        /*
         * This enables receiving Notification messages in the plugin
         * @override
         */
        isSubscribingToNotifications: function() {
            var oConfiguration = this.getConfiguration();
            var bNotificationsEnabled = true;
            if (oConfiguration && typeof oConfiguration.notificationsEnabled !== "undefined") {
                bNotificationsEnabled = oConfiguration.notificationsEnabled;
            }
            return bNotificationsEnabled;
        },

        /*
         * Return the event name (i.e.; CUSTOM.USER_MESSAGE)
         * being subscribed to by this plugin
         * @override
         */
        getCustomNotificationEvents: function(sTopic) {
            return ["USER_MESSAGE"];
        },

        /*
         * Return the function to be called when a CUSTOM.USER_MESSAGE
         * notification message is received
         * @override
         */
        getNotificationMessageHandler: function(sTopic) {
            if (sTopic === "USER_MESSAGE") {
                return this._handleNotificationMessage;
            }
            return null;
        },

        _handleNotificationMessage: function(oMsg) {
            var sMessage = "Message not found in payload 'message' property";
            if (oMsg && oMsg.parameters && oMsg.parameters.length > 0) {
                for (var i = 0; i < oMsg.parameters.length; i++) {
                    if (oMsg.parameters[i].name === "message") {
                        sMessage = oMsg.parameters[i].value;
                        break;
                    }
                }
            }
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            oData.notificationMessage = sMessage;
            oModel.refresh();
        }
    });

    return oPluginViewController;
});
