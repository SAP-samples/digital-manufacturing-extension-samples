sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/orderCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onGetCardData: OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorOrderSummaryExtensionProvider.PluginEventExtension", {
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
            return oPromise.then((oData) => {
                // add units to quantities
                const sUom = oData.content.ProductionUnitOfMeasure ? oData.content.ProductionUnitOfMeasure : oData.content.BaseUnitOfMeasure;
                oData.content.QuantityReleased = `${oData.content.QuantityReleased || 0} ${sUom}`;
                oData.content.QuantityScrapped = `${oData.content.QuantityScrapped || 0} ${sUom}`;
                return oData;
            });
        }
    })
});
