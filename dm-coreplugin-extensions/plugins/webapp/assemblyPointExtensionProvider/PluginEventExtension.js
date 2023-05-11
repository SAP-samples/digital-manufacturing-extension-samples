sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/assyplugins/assemblyPointPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.assemblyPointExtensionProvider.PluginEventExtension", {
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
            } else if (sOverrideMember === PluginEventConstants.ON_COMPONENT_REMOVE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_AUTO_ASSEMBLY_SUCCESS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_AUTO_ASSEMBLY_ERROR) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.GENERATE_ASSEMBLY_DATA_FIELDS) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ADD_PRESS_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.POST_ADD_REQUEST) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_SUCCESSFUL_ADD_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_FOCUS_TO_DATA_FIELD) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_FOCUS_TO_FIND_COMPONENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ADD_ERROR) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_SKIP) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_CLOSE) {
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
            let bClear = false;
            if (oEvent) {
                if (oEvent.selections) {
                    this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectEvent: oEvent.selections = ", oEvent.selections);
                }
                this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectEvent: oEvent.clearInput = ", oEvent.clearInput);
                if (typeof oEvent.clearInput !== "undefined") {
                    bClear = oEvent.clearInput;
                }
            }
            if (bClear) {
                this._oExtensionUtilities.setAllAssembled(true);
                this._oExtensionUtilities.focusOnMainInputField(this.getController(), false);
                this._oExtensionUtilities.setAllAssembled(false);
            }
        },

        onInputChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onInputChangeEvent: Hi");
            if (oEvent) {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onInputChangeEvent: new value = " + oEvent.newValue + ", oldValue = " + oEvent.oldValue);
            }
        },

        onOperationChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationChangeEvent: hi");
            if (oEvent) {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationChangeEvent: new value = " + oEvent.newValue + ", oldValue = " + oEvent.oldValue);
            }
        },

        onComponentChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onComponentChangeEvent: hi");
            if (oEvent && oEvent.currentComponent) {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onComponentChangeEvent: Current Component = ", oEvent.currentComponent);
            }
        },

        onComponentRemoveEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onComponentRemoveEvent: hi");
            if (oEvent && oEvent.currentComponent) {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onComponentRemoveEvent: Current Component = ", oEvent.currentComponent);
            }
        },

        onAutoAssemblySuccess: function(oResponse){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAutoAssemblySuccess: oResponse = ", oResponse);
        },

        onAutoAssemblyError: function(oError){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAutoAssemblyError: oError = ", oError);
        },

        generateAssemblyDataFields: function(oComponentData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.generateAssemblyDataFields: oComponentData = ", oComponentData);
        },
    
        onAddPress: function(){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAddPress: hi");
        },
    
        postAddRequest: function(sUrl, oPayload, iQuantityToAssemble){
            this._oExtensionUtilities.logMessage("PluginEventExtension.postAddRequest: sUrl = ", sUrl);
            this._oExtensionUtilities.logMessage("PluginEventExtension.postAddRequest: iQuantityToAssemble = ", iQuantityToAssemble);
            this._oExtensionUtilities.logMessage("PluginEventExtension.postAddRequest: oPayload = ", oPayload);
        },

        onSuccessfulAdd: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSuccessfulAdd: oEvent = ", oEvent);
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSuccessfulAdd: oEvent = ", oEvent);
            let oResponseData = oEvent.responseData;
            let bAllAssembled = false;
            if (oResponseData && typeof oResponseData.sfcAssembled !== "undefined") {
                bAllAssembled = oResponseData.sfcAssembled;
            }
            this._oExtensionUtilities.setAllAssembled(bAllAssembled);
            if (bAllAssembled) {
                this._oExtensionUtilities.focusOnMainInputField(this.getController(), false);
            }
        },

        onFocusToDataField: function(oFocusField){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFocusToDataField: hi");
        },

        onFocusToFindComponent: function(oFocusField){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFocusToFindComponent: hi");
            this._oExtensionUtilities.setAllAssembled(true);
            this._oExtensionUtilities.focusOnMainInputField(this.getController(), true);
            this._oExtensionUtilities.setAllAssembled(false);
        },

        onAddError: function(oError){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onAddError: oError = ", oError);
        },

        onSkip: function(oComponentData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSkip: oComponentData = ", oComponentData);
        },

        onClose: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onClose: hi");
        }
    })
});
