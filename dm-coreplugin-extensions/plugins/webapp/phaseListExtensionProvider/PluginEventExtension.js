sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/phaseListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.phaseListExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_ORDER_SELECTION_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_REFRESH_PHASE_LIST) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PHASE_LIST_MODEL_REFRESHED) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PRESS_START_PHASE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_START_PHASE_SUCCESS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_START_PHASE_ERROR) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PRESS_COMPLETE_PHASE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMPLETE_PHASE_SUCCESS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMPLETE_PHASE_ERROR) {
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

        onOrderSelectionEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOrderSelectionEvent: Phase List extension");
        },

        onRefreshPhaseList: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onRefreshPhaseList: Phase List extension");
        },

        onPhaseListModelRefreshed: function(oModel){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPhaseListModelRefreshed: Phase List extension");
            let aResponseData = oModel.getData();
            if (aResponseData && aResponseData.length > 0) {
                for (let oResponse of aResponseData) {
                    oResponse.customText = this._getCustomText()
                }
            }
        },

        onPressStartPhase: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPressStartPhase: Phase List extension");
        },

        onStartPhaseSuccess: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onStartPhaseSuccess: Phase List extension");
        },

        onStartPhaseError: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onStartPhaseError: Phase List extension");
        },

        onPressCompletePhase: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPressCompletePhase: Phase List extension");
        },

        onCompletePhaseSuccess: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCompletePhaseSuccess: Phase List extension");
        },

        onCompletePhaseError: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCompletePhaseError: Phase List extension");
        },
       
        _getCustomText: function() {
           return parseInt(Math.random() * Math.pow(10,5));
        },
    })
});
