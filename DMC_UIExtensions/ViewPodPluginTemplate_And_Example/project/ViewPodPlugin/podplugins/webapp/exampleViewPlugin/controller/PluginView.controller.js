sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/base/Log"
], function (JSONModel, PluginViewController, Log) {
    "use strict";

    var oLogger = Log.getLogger("exampleExecutionPlugin", Log.Level.INFO);
    
    var oPluginViewController = PluginViewController.extend("vendor.ext.viewplugins.exampleViewPlugin.controller.PluginView", {
        metadata: {
            properties: {
            }
        },

        onInit: function () {
            if (PluginViewController.prototype.onInit) {
                PluginViewController.prototype.onInit.apply(this, arguments);
            }
        },

        /**
         * @see PluginViewController.onBeforeRenderingPlugin()
         */
        onBeforeRenderingPlugin: function () {
            // subscribe on POD events
            this.subscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
            this.subscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
            this.subscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
            var oConfig = this.getConfiguration();
            // check if close icon should be displayed
            this.configureNavigationButtons(oConfig); 
        },

        onExit: function () {
            if (PluginViewController.prototype.onExit) {
                PluginViewController.prototype.onExit.apply(this, arguments);
            }
            // unsubscribe from POD events on exit
            this.unsubscribe("PodSelectionChangeEvent", this.onPodSelectionChangeEvent, this);
            this.unsubscribe("OperationListSelectEvent", this.onOperationChangeEvent, this);
            this.unsubscribe("WorklistSelectEvent", this.onWorkListSelectEvent, this);
        },

        onBeforeRendering: function () {
            this.loadModel();
        },

        onAfterRendering: function () {
        },

        onPodSelectionChangeEvent: function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this.loadModel();
        },

        onOperationChangeEvent: function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this.loadModel();
        },

        onWorkListSelectEvent: function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            this.loadModel();
        },

        loadModel: function () {
            var oView = this.getView();
            var oPodController = this.getPodController();
            var oConfiguration = this.getConfiguration();
            var bNotificationsEnabled = true;
            // if notification is enabled
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
            var sInput, sSfc, sMaterial, sShopOrder;
            var aSelections = oPodSelectionModel.getSelections();
            if (aSelections && aSelections.length > 0) {
                for (var i = 0; i < aSelections.length; i++) {
                    sInput = aSelections[i].getInput();
                    if (sInput && sInput !== "") {
                        sSfc = "";
                        if (aSelections[i].getSfc()) {
                            sSfc = aSelections[i].getSfc().getSfc();
                        }
                        sMaterial = "";
                        if (aSelections[i].getItem()) {
                            sMaterial = aSelections[i].getItem().getItem();
                        }
                        sShopOrder = "";
                        if (aSelections[i].getShopOrder()) {
                            sShopOrder = aSelections[i].getShopOrder().getShopOrder();
                        }
                        aInputs[aInputs.length] = {
                            input: sInput,
                            sfc: sSfc,
                            material: sMaterial,
                            shopOrder: sShopOrder
                        };
                    }
                }
                iSelectionCount = aInputs.length;
            }

            var iOperationCount = 0;
            var aOperations = [];
            var aMaterialCustomFields = [];
            var sOperation;
            var oOperations = oPodSelectionModel.getOperations();
            if (oOperations && oOperations.length > 0) {
                for (var i = 0; i < oOperations.length; i++) {
                    sOperation = oOperations[i].operation;
                    if (sOperation) {
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
                resource: sResource,
                selectionCount: iSelectionCount,
                operationCount: iOperationCount,
                selections: aInputs,
                operations: aOperations,
                notificationsEnabled: bNotificationsEnabled,
                notificationMessage: "",
                materialCustomFields: aMaterialCustomFields
            };

            if (aOperations.length === 1) {
                oModelData.operation = aOperations[0].operation;
            }
            // add material custom fields to model
            this.addMaterialCustomFields(oPodController.getUserPlant(), sMaterial);
            //oLogger.info("oModel: " + JSON.stringify(oModelData));
            var oModel = new JSONModel(oModelData);

            oView.setModel(oModel);
        },

        /*
         * This enables receiving Notification messages in the plugin
         * @override
         */
        isSubscribingToNotifications: function () {
            var oConfiguration = this.getConfiguration();
            var bNotificationsEnabled = true;
            if (oConfiguration && typeof oConfiguration.notificationsEnabled !== "undefined") {
                bNotificationsEnabled = oConfiguration.notificationsEnabled;
            }
            return bNotificationsEnabled;
        },

        /*
         * Return the event name (i.e.;MEASUREMENT) being subscribed to by this plugin
         * @override
         */
        getCustomNotificationEvents: function () {
            return ["MEASUREMENT"];
        },

        /*
         * Return the function to be called when a MEASUREMENT notification message is received
         * @override
         */
        getNotificationMessageHandler: function (sTopic) {
            if (sTopic === "MEASUREMENT") {
                return this.handleNotificationMessage;
            }
            return null;
        },

        handleNotificationMessage: function (oMsg) {
            //oLogger.info("handleNotificationMessage oMsg:" + oMsg);
            var sMessage = "Message not found in payload 'message' property";
            if (oMsg && oMsg.parameters && oMsg.parameters.length > 0) {
                for (var i = 0; i < oMsg.parameters.length; i++) {
                    if (oMsg.parameters[i].name === "message") {
                        sMessage = oMsg.parameters[i].value;
                        break;
                    }
                }
            }
            this.getView().getModel().setProperty("/notificationMessage", sMessage);
        },

        addMaterialCustomFields: function (sPlant, sMaterial) {
            // Populate parameters with plant and material name 
            var oParameters = {
                plant: sPlant,
                material: sMaterial
            };
            var sUrl = this.getPublicApiRestDataSourceUri() + "/material/v1/materials";
            // Ajax GET request to read Material custom fields by using Public API 
            this.executeAjaxGetRequest(sUrl, oParameters);           
        },

        executeAjaxGetRequest: function (sUrl, oParameters) {
            var that = this;
            this.ajaxGetRequest(sUrl, oParameters,
                function (oResponseData) {
                    that.handleResponse(oResponseData);
                },
                function (oError, sHttpErrorMessage) {
                    that.handleError(oError, sHttpErrorMessage);
                }
            );
        },

        handleResponse: function (oResponseData) {            
            if (oResponseData && oResponseData.length > 0) {
                // set customValues data to model property "materialCustomFields"    
                this.getView().getModel().setProperty("/materialCustomFields", oResponseData[0].customValues);
            }
        },

        handleError: function (oError, sHttpErrorMessage) {
            var err = oError || sHttpErrorMessage;
            // show error in message toast   
            this.showErrorMessage(err, true, true);
        },
        
        configureNavigationButtons: function (oConfiguration) {
            if (!this.isPopup() && !this.isDefaultPlugin()) {
                this.byId("closeButton").setVisible(oConfiguration.closeButtonVisible);
            }
        } 
    });

    return oPluginViewController;
});


