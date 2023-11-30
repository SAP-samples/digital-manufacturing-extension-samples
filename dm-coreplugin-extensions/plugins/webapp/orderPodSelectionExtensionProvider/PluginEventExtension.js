sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/orderPodSelectionPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.orderPodSelectionExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_FILTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORK_CENTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            };
            return null;
        },
        
        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        onFilterChangeEvent: function(sEvent, oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFilterChangeEvent: Order POD Selection extension, sEvent = " + sEvent);
        },

        onWorkCenterChangeEvent: function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorkCenterChangeEvent: Order POD Selection extension");
        }
    })
});
