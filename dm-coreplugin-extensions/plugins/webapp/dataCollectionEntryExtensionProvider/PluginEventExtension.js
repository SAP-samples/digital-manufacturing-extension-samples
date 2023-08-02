sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/dcplugins/dataCollectionEntryPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ext/extplugins/utils/ElectronicSignatureHandler",
    "sap/m/MessageBox"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, ElectronicSignatureHandler, 
             MessageBox) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.dataCollectionEntryExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_OPERATION_LIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_DC_LIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.REFRESH_DATA_COLLECTION_LIST) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CLOSE_PLUGIN) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.RENDER_DC_ENTRY) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COLLECT_DATA) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.LOG_DATA_COLLECTION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_LOG_DATA_COLLECTION_RESPONSE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_LOG_DATA_COLLECTION_ERROR) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_NEXT_GROUP) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PARAMETER_CHANGE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.CREATE_DATA_COLLECTION_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_LIST_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_TABLE_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_COLUMN_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMMENTS_BUTTON_PRESSED) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_COMMENTS_DIALOG_MODEL_DATA) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMMENTS_DIALOG_OK_PRESS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMMENTS_DIALOG_CANCEL_PRESS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_FILE_ATTACHMENTS_BUTTON_PRESS) {
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

        onWorklistSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectEvent: hi");
        },

        onPodSelectionChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: hi");
        },

        onOperationListSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationListSelectEvent: hi");
        },

        onDataCollectionListSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onDataCollectionListSelectEvent: hi");
        },

        refreshDataCollectionList: function(oSelectDc){
            this._oExtensionUtilities.logMessage("PluginEventExtension.refreshDataCollectionList: hi");
        },

        onClosePlugin: function(){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onClosePlugin: hi");
        },

        renderDcEntry: function(oDcData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.renderDcEntry: hi");
        },
    
        onCollectData: function(bIsValidated){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCollectData: hi");

            this.promptAcknowledgment();
        },

        promptAcknowledgment: function() {
            let sMessage = "Data collected!  Press OK to have supervisor add signature.";
            let that = this;
            let bCompact = this._isViewCompactSize();
            MessageBox.confirm(sMessage, {
                title: "Acknowledge completion of step",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that.addSupervisorSignature();
                    }
                }
            });
        },

        _isViewCompactSize: function () {
            let oController = this.getController();
            if (oController && oController.getView) {
                return !!oController.getView().$().closest(".sapUiSizeCompact").length;
            }
            return null;
        },

        addSupervisorSignature: function () {
            let oController = this.getController();
            let mDialogSettings = {
                parentView: oController.getView(),
                message: "Add signature to verify data was collected",
                reason: "",
                showMessage: true,
                showReason: true,
                reasonEditable: true,
                showComment: true,
                showToolbar: false
            };
            let oHandler = new ElectronicSignatureHandler(this);
            oHandler.openSignatureDialog(mDialogSettings);
        },

        onSigningSuccess: function () {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSigningSuccess: hi");
        },

        onSigningError: function (oError) {
            this.oController.showErrorMessage(oError.message, true, true);
        },

        logDataCollection: function(oParameters){
            this._oExtensionUtilities.logMessage("PluginEventExtension.logDataCollection: hi");
        },

        onLogDataCollectionResponse: function(oResponseData, oLoggedData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onLogDataCollectionResponse: hi");
        },

        onLogDataCollectionError: function(oError){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onLogDataCollectionError: hi");
        },

        onNextGroup: function(){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onNextGroup: hi");
        },

        onParameterChange: function(sId){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onParameterChange: hi");
        },

        createDataCollectionTable: function(oPluginConfiguration, oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.createDataCollectionTable: hi");
        },

        updateListConfiguration: function(oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateListConfiguration: oListConfiguration hi");
        },

        updateTableConfiguration: function(oTableConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateTableConfiguration: oTableConfiguration hi");
        },

        updateColumnConfiguration: function(aColumnConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateColumnConfiguration: hi");
        },

        onCommentsButtonPressed: function(oData, sButtonId){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCommentsButtonPressed: hi");
        },

        updateCommentDialogModelData: function(oDialogData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateCommentDialogModelData: hi");
        },

        onCommentDialogOkPress: function(oCommentData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCommentDialogOkPress: hi");
        },

        onCommentDialogCancelPress: function(){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCommentDialogCancelPress: hi");
        },

        onFileAttachmentsButtonPress: function(sBindingContextPath){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFileAttachmentsButtonPress: hi");
        }
    })
});
