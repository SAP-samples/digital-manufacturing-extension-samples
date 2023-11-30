sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/wcPodSelectionPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.wcPodSelectionExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities, oExtensionUtility) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oExtensionUtility = oExtensionUtility;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_FILTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_OPERATION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CLEAR_FILTER_BAR) {
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
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFilterChangeEvent: WC POD Selection extension, sEvent = " + sEvent);
        },

        onOperationChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationChangeEvent: WC POD Selection extension");
        },

        onWorklistSelectionChangeEvent: function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectionChangeEvent: WC POD Selection extension");
        },

        onClearFilterBar: function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onClearFilterBar: WC POD Selection extension");
            let oPodSelectionModel = this.getController().getPodSelectionModel();
            if (oPodSelectionModel) {
                oPodSelectionModel.customData = {};
            }
            let aFilters = this._oExtensionUtility.getCustomFilterControls();
            if (aFilters && aFilters.length > 0) {
                for (let oControl of aFilters) {
                    oControl.setValue("");
                }
            }
        }
    })
});
