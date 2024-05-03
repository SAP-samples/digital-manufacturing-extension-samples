sap.ui.define([
    'jquery.sap.global',
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter"
], function (jQuery, PluginViewController, JSONModel, MessageToast, ODataModel, Filter) {
    "use strict";

    return PluginViewController.extend("huka.custom.plugin.whereUsedPlugin.whereUsedPlugin.controller.MainView", {
        onInit: function () {
            PluginViewController.prototype.onInit.apply(this, arguments);
            // Create and set a Model based on OData to the view to display the details of the SFC we retrieve by calling the SFC MDO
            var SfcSmartTable = this.getView().byId("SfcSmartTable");
            var mdoModel = this.getView().getModel("mdo");
            var that = this;
            // to ensure the model is proberly loaded and set to the view, we initialize the model during initialization of the controller instead in the MainView.view.xml directly
            mdoModel.metadataLoaded().then(function () {
                SfcSmartTable.setModel(mdoModel);
                SfcSmartTable.setEntitySet("SFC");
                SfcSmartTable.rebindTable(true);
                SfcSmartTable.setInitiallyVisibleFields("Plant,Sfc,Order,Material,Status");
                that.onEnterCompId();
            });
        },

        /*
        this function is called only once when opening the POD. 
        */
        onBeforeRenderingPlugin: function () {
            // retrieve configuration parameters set in during POD configuration in the POD Designer and assign them to view elements or variables
            this.getView().byId("panelPlugin").setHeaderText(this.getConfiguration().title);
            this.getView().byId("textPlugin").setText(this.getConfiguration().text);
            this.swhereUsedPPDKey = this.getConfiguration().whereUsedPPD;
        },


        /*
        Call to the PPD which returns all SFCs where a specific ComponentInventory or multiple Component Inventories are used
        Componenent Inventory can be a FloorStock ID or an SFC itself which was produced in a previous step
        */
        _retrieveWhereComponentUsed(swhereUsedPPDKey, sComponents) {
            var that = this;
            return new Promise(function (resolve, reject) {      
                if (sComponents != null) {
                    var url = that.getPublicApiRestDataSourceUri() + 'pe/api/v1/process/processDefinitions/start?async=false&key=' + swhereUsedPPDKey;
                    console.log(url);
                    var aSFCs = [];
                    var payload = { "inComponentInventoryIDs": sComponents }
                    var aResponds = [];
                    // ajax calls are always called async
                    that.ajaxPostRequest(url, payload,
                        function (aResponds) {  // anonym function we are calling, as we need to save the parent context we store this into that before
                            if (aResponds.oSFCsResultList.length) { // SFCs where the component was used have been found
                                for (var iCount = 0; iCount < aResponds.oSFCsResultList.length; iCount++) {
                                    aSFCs.push(aResponds.oSFCsResultList[iCount])
                                }
                            }
                            resolve(aSFCs)
                        }, function (oError) {
                            reject("Error occured during _retrieveWhereComponentUsed")
                        }

                    )
                }
            });
        },

        /*Event called once Component Ids are entered or the Search Button was pressed.
        */
        onEnterCompId: function (oEvent) {
            var inventoryID = this.getView().byId("inputInvenntoryId").getValue();
            var that = this;
            var SfcSmartTable = that.getView().byId("SfcSmartTable");
            var oTable = SfcSmartTable.getTable();
            var sPlant = this.getPodController().getUserPlant();
            var aFilters = [];

            if (inventoryID) { // check if a search parameter was entered
                var aInvIds = [];
                aInvIds.push(inventoryID);

                // call _retrieveWhereComponentUsed using promise Function to ensure an synchronous return
                this._retrieveWhereComponentUsed(this.swhereUsedPPDKey, aInvIds).then(function (awhereUsedSfs) {
                    if (awhereUsedSfs.length > 0) {
                        for (var iCount = 0; iCount < awhereUsedSfs.length; iCount++) {
                            aFilters.push(
                                new Filter(
                                    "Sfc",
                                    sap.ui.model.FilterOperator.EQ,
                                    awhereUsedSfs[iCount]
                                )
                            );
                        }
                        oTable.getBinding("items").filter(aFilters);
                    }
                    else { // if no SFC was found search parameter was entered  but nothing was found set the filter so no data gets found e.g. Plant = "undefined" by default Smart Table displays all SFCS
                        aFilters.push(
                            new Filter(
                                "Plant",
                                sap.ui.model.FilterOperator.EQ,
                                "undefined"
                            )
                        );
                        oTable.getBinding("items").filter(aFilters);
                        MessageToast.show("The Inventory ID entered is not used in any SFC. Please check if your input is correct.");

                    }
                });

            } else { // if no search parameter was entered set the filter so no data gets found e.g. Plant = "undefined" by default Smart Table displays all SFCS
                aFilters.push(
                    new Filter(
                        "Plant",
                        sap.ui.model.FilterOperator.EQ,
                        sPlant
                    )
                );
                oTable.getBinding("items").filter(aFilters);
                MessageToast.show("All SFCs are retrieved, please enter a Inventory ID to specify your search");
            }
        },

        /*
        Called before the model is binded to the table
        */
        onBeforeRebindTable: function (oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            var sPlant = this.getPodController().getUserPlant();

            mBindingParams.filters.push(
                new sap.ui.model.Filter(
                    "Plant",
                    sap.ui.model.FilterOperator.EQ,
                    sPlant
                )
            );
            MessageToast.show("All SFCs are retrieved, please enter a Inventory ID to specify your search");
        },

        /*
        Event called once button "Follow Up Action" are pressed. 
        Here e.g. a call to a PPD or API can be implemented to performs any action on the selected item of the result table
        */
        onFollowUpAction_01: function (oEvent) {
            MessageToast.show(" Trigger follow up Action");
            var items = this.getView().byId("SfcDetailTable").getSelectedItems();
            var aSfcsSelected = []
            for (var iCount = 0; iCount < items.length; iCount++) {
                var selectedSfc = items[iCount].getBindingContext().getProperty("Sfc");
                aSfcsSelected.push(selectedSfc);
            }
            MessageToast.show("SFCs selected could be passed on to Follow up Action e.g. call a PPD or function with the selected SFC <"+ aSfcsSelected.toString()+"> as parameter.");
        },

        /* 
        onAfterRendering is called everytime the POD gets changed e.g. after every backend call which leads  to a refresh of the page
         */
        onAfterRendering: function () { },


        isSubscribingToNotifications: function () {
            var bNotificationsEnabled = true;
            return bNotificationsEnabled;
        },


        getCustomNotificationEvents: function (sTopic) {
            //return ["template"];
        },


        getNotificationMessageHandler: function (sTopic) {
            //if (sTopic === "template") {
            //    return this._handleNotificationMessage;
            //}
            return null;
        },

        _handleNotificationMessage: function (oMsg) {
            var sMessage = "Message not found in payload 'message' property";
            if (oMsg && oMsg.parameters && oMsg.parameters.length > 0) {
                for (var i = 0; i < oMsg.parameters.length; i++) {

                    switch (oMsg.parameters[i].name) {
                        case "template":

                            break;
                        case "template2":


                    }
                }
            }

        },

        onExit: function () {
            PluginViewController.prototype.onExit.apply(this, arguments);
        }
    });
});