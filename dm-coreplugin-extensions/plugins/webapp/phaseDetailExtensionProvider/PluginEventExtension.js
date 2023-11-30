sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/phaseDetailPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.phaseDetailExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_PHASE_LIST_SELECTION_EVENT) {
                return OverrideExecution.After
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

        onPhaseListSelectionEvent: function(oEvent){
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPhaseListSelectionEvent: Phase Detail extension");
        },

        updateCustomData: function(){
            let oController = this.getController();
            if (!oController) {
                return;
            }
            let oPodSelectionModel = oController.getPodSelectionModel();
            if (oPodSelectionModel) {
                let sInspectionRequired = "No";
                if (oPodSelectionModel.customData && 
                    typeof oPodSelectionModel.customData.inpectionRequired !== "undefined") {
                    if (oPodSelectionModel.customData.inpectionRequired) {
                        sInspectionRequired = "Yes";
                    };
                }
                oPodSelectionModel.customData.isInpectionRequired = sInspectionRequired;
                let oModel = new JSONModel(oPodSelectionModel.customData);
                oController.getView().setModel(oModel, "customData");
            }
        }
    })
});
