sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/worklistPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.worklistExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_MAIN_INPUT_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PAGE_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_REFRESH_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_OPERATION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ITEM_PRESS_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_TABLE_MODEL_UPDATE_EVENT) {
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
        
        onPageChangeEvent : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPageChangeEvent: hi");
        },

        onWorklistSelectionChangeEvent : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectionChangeEvent: hi");
        },

        onWorklistRefreshEvent : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistRefreshEvent: hi");
        },

        onOperationChangeEvent : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationChangeEvent: hi");
        },

        onPodSelectionChangeEvent : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: hi");
        },

        onItemPressEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onItemPressEvent: hi");
        },

        onSelectionChangeEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSelectionChangeEvent: hi");
        },

        onTableModelUpdateFinished : function(sReason){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onTableModelUpdateFinished: sReason = " + sReason);
        }
    })
});
