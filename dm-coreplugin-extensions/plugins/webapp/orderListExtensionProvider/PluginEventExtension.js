sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/orderSelectionListPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.orderListExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_REFRESH_ORDER_LIST) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CHANGE_RESOURCE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CHANGE_WORK_CENTER) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CHANGE_ORDER_ID) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CHANGE_MATERIAL_NUMBER) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CHANGE_PLANNED_DATE_RANGE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ORDER_STATUS_FILTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_SFC_STATUS_FILTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_LIST_PRESS_EVENT) {
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
        
        onChangeResource : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onChangeResource: hi");
        },

        onChangeWorkCenter : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onChangeWorkCenter: hi");
        },

        onChangeOrderId : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onChangeOrderId: hi");
        },

        onChangeMaterialNumber : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onChangeMaterialNumber: hi");
        },

        onChangePlannedDateRange : function(oData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onChangePlannedDateRange: hi");
        },

        onPodSelectionChangeEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: hi");
        },

        onOrderStatusFilterChangeEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOrderStatusFilterChangeEvent: hi");
        },

        onSfcStatusFilterChangeEvent : function(sReason){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSfcStatusFilterChangeEvent: hi");
        },

        onListPressEvent : function(sReason){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onListPressEvent: hi");
        },

        onSelectionChangeEvent : function(sReason){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSelectionChangeEvent: hi");
        },

        onTableModelUpdateFinished : function(sReason){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onTableModelUpdateFinished: hi");
        }
    })
});
