sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/orderCardPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.orderCardExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_ORDER_SELECTION_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_GOODS_RECEIPT_SUMMARY_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PHASE_SELECTION_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_UPDATE_GOODS_RECEIPT_QUANTITY) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_REFRESH_GOODS_RECEIPT_QUANTITY) {
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
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOrderSelectionEvent: Order Card extension");
        },

        onGoodsReceiptSummaryEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onGoodsReceiptSummaryEvent: Order Card extension");
        },

        onPhaseSelectionEvent: function(oEvent){
            this.updateCustomData();
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPhaseSelectionEvent: Order Card extension");
        },

        onUpdateGoodsReceiptQuantity: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onUpdateGoodsReceiptQuantity: Order Card extension");
        },

        onRefreshGoodsReceiptQuantity: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onRefreshGoodsReceiptQuantity: Order Card extension");
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
