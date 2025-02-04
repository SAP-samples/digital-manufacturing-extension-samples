sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/service/ServiceClient",
    "sap/dm/dme/lmplugins/yieldAndScrapTableCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, ServiceClient, PluginEventConstants) {
    "use strict";

    const BASE_API_PATH = "/sapdmdmepod/fnd/api-gateway-ms";

    ServiceClient = new ServiceClient();

    const oOverrideExecution = {
        onGetCardData: OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorYieldAndScrapExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities, oLogUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oLogUtilities = oLogUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (oOverrideExecution.hasOwnProperty(sOverrideMember)) {
                return oOverrideExecution[sOverrideMember];
            }
            return null;
        },

        getExtensionName: function() {
            return PluginEventConstants.EXTENSION_NAME;
        },

        /*
         * OverrideExecution.After handler for onGetCardData.
         * Using OverrideExecution.Instead would prevent the default API call from occurring, meaning all data would have to be fetched here.
         *
         * This function is provided the Promise from the default Order API call.
         * Properties of the original response can be modified or added to.
         * Separate API calls can also be made here to fetch additional data to be added to the resolved object.
         *
         * This function must return a promise that resolves to the object used for model binding.
         */
        onGetCardData: function(oFilters, oPromise) {
            this._oLogUtilities.logMessage("PluginEventExtension.onGetCardData: called");

            // This example uses OverrideExecution.After, so oPromise will resolve to the aggregated data for the currently selected order
            return oPromise.then((oData) => {
                if (this._oLogUtilities.bLogToConsole) {
                    console.debug("PluginEventExtension.onGetCardData: promise resolved", oData);
                }

                oData.content.forEach(a => a.phaseDescription = `Order ${oFilters.order} - ${a.phaseDescription}`);

                // We can also fetch aggregated data for some other order, then combine or modify the results
                const sPlant = oFilters.plant;
                const sWorkCenter = oFilters.workCenter;
                const aOrderExecutionStatuses = ["ACTIVE", "NOT_IN_EXECUTION"];
                return this._getFirstOrder(sPlant, sWorkCenter, aOrderExecutionStatuses).then((oOrder) => {
                    if (!oOrder) {
                        return oData;
                    }
                    
                    const sSecondOrderId = oOrder.order;
                    this._oLogUtilities.logMessage("PluginEventExtension.onGetCardData: retrieved second order " + sSecondOrderId);

                    // Get yield and scrap data for some other order; concat the results
                    return this.getCoreExtension().getYieldAndScrapData(sPlant, sSecondOrderId, sWorkCenter).then((oData2) => {
                        oData2.content.forEach(a => a.phaseDescription = `Order ${sSecondOrderId} - ${a.phaseDescription}`);
                        return {
                            content: oData.content.concat(oData2.content)
                        };
                    });
                });
            });
        },

        /**
         * This is a simple API fetch to get an arbitrary order for demonstration purposes, so that the sample will work in as many systems as possible without data prerequisites.
         *
         * Each use case will have different needs as far as order data is concerned, so use an API fetch based on your specific requirements.
         */
        _getFirstOrder: function(sPlant, sWorkCenter, aExecutionStatuses) {
            // API details: https://api.sap.com/api/sapdme_order/resource/Order_List
            const sRequestPath = `${BASE_API_PATH}/order/v1/orders/list?plant=${sPlant}&workCenters=${sWorkCenter}&executionStatuses=${aExecutionStatuses.join(",")}&size=1`;
            return ServiceClient.get(sRequestPath).then((oResponse) => {
                return oResponse?.content?.length ? oResponse.content[0] : null;
            });
        }
    })
});
