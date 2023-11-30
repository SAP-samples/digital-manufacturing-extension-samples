sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/headerInformationPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.sfcCardExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_QUANTITY_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PAGE_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.REFRESH_HEADER_INFORMATION) {
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

        onSelectionChangeEvent: function(oEvent){
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSelectionChangeEvent: hi");
        },

        onQuantityChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onQuantityChangeEvent: hi");
        },

        onPageChangeEvent: function(oEvent){
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPageChangeEvent: hi");
        },

        refreshHeaderInformation: function(bInitialLoading){
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.refreshHeaderInformation: bInitialLoading = " + bInitialLoading);
            let oConfigurationData, oData;
            let oConfigurationModel = this.getCoreExtension().getInformationConfigurationModel();
            if (oConfigurationModel) {
                oConfigurationData = oConfigurationModel.getData();
            }
            let oDataModel = this.getCoreExtension().getInformationDataModel();
            if (oDataModel) {
                oData = oDataModel.getData();
            }
        },

        updateCustomData: function(){
            let oController = this.getController();
            if (!oController) {
                return;
            }
            let oPodSelectionModel = oController.getPodSelectionModel();
            if (oPodSelectionModel) {
                if (!oPodSelectionModel.customData) {
                    oPodSelectionModel.customData = {supplier: ""};
                }
                let oModel = new JSONModel(oPodSelectionModel.customData);
                oController.getView().setModel(oModel, "customData");
            }
        }
    })
});
