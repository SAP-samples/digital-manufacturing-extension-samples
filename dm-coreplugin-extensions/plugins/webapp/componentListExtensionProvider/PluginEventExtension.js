sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/assyplugins/componentListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/dm/dme/podfoundation/util/PodUtility"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, PodUtility) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.componentListExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_INPUT_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_OPERATION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ASSEMBLE_COMPONENT_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COMPONENT_ASSEMBLED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PRODUCTION_PROCESS_SUCCESS_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_AUTO_ASSEMBLY_SFC_STATE_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.LOAD_COMPONENTS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ASSEMBLE_BUTTON_PRESSED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_REMOVE_BUTTON_PRESSED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ERROR_REMOVING_COMPONENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.CREATE_AND_REFRESH_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_LIST_CONFIGURATION) {
                return OverrideExecution.Before;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_TABLE_CONFIGURATION) {
                return OverrideExecution.Before;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_COLUMN_CONFIGURATION) {
                return OverrideExecution.Before;
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

        onInputChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onInputChangeEvent: hi");
        },

        onOperationChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationChangeEvent: hi");
        },

        onPodSelectionChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: hi");
        },

        onAssemblyPointComponentChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAssemblyPointComponentChangeEvent: hi");
        },

        onComponentAssembledEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onComponentAssembledEvent: hi");
        },

        onProductionProcessSuccessEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onProductionProcessSuccessEvent: hi");
        },

        onAutoAssembledSfcStateChangedEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAutoAssembledSfcStateChangedEvent: hi");
        },
    
        loadComponent: function(oComponentList){
            this._oExtensionUtilities.logMessage("PluginEventExtension.loadComponent: oComponentList = ", oComponentList);
        },

        onAssembleButtonPressedEvent: function(oSelectionData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAssembleButtonPressedEvent: oSelectionData = ", oSelectionData);
        },

        onRemoveButtonPressedEvent: function(oPayload, oSelectionData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onRemoveButtonPressedEvent: oPayload = ", oPayload);
            this._oExtensionUtilities.logMessage("PluginEventExtension.onRemoveButtonPressedEvent: oSelectionData = ", oSelectionData);
        },

        onErrorRemovingComponent: function(sError){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onErrorRemovingComponent: oError = " + sError);
        },

        createAndRefreshTable: function(oPluginConfiguration, oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.createAndRefreshTable: hi");
        },

        updateListConfiguration: function(oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateListConfiguration: oListConfiguration hi");
        },

        updateTableConfiguration: function(oTableConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateTableConfiguration: oTableConfiguration hi");
        },

        updateColumnConfiguration: function(aColumnConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateColumnConfiguration: hi");
        }
    })
});
