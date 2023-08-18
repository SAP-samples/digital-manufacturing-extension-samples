sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/changeEquipmentStatus/controller/extensions/PluginEventExtensionConstants",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, MessageBox, MessageToast) {
    "use strict";

    const oOverrideExecution = {
        handleSaveResourceStatus: OverrideExecution.Instead
    };

    return PluginControllerExtension.extend("sap.example.plugins.changeEquipmentStatusExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (oOverrideExecution.hasOwnProperty(sOverrideMember)) {
                return oOverrideExecution[sOverrideMember];
            }
            return null;
        },

        getExtensionName: function() {
            return PluginEventConstants.EXTENSION_NAME;
        },

        /**
         * Function to wrap the behavior of the base "handleSaveResourceStatus" method, which is called when the
         * save button is pressed.
         * 
         * @param {string} sUrl - The URL to call when saving the updated equipment status.
         * @param {object} oRequestBody - The request body.
         */
        handleSaveResourceStatus: function(sUrl, oRequestBody) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.handleSaveResourceStatus: called");

            let oConfiguration = this.getController().getConfiguration();
            if (!oConfiguration?.hasOwnProperty("confirmStatusChange") || !oConfiguration.confirmStatusChange) {
                // Call the original function without confirmation prompt
                this.getController().handleSaveResourceStatus(sUrl, oRequestBody);
                return;
            }

            MessageBox.confirm(`Do you really want to change the status of ${oRequestBody.resource} to ${oRequestBody.status}?`, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],

                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.YES) {
                        this._oExtensionUtilities.logMessage("PluginEventExtension.handleSaveResourceStatus: Calling original function...");
                        this.getController().handleSaveResourceStatus(sUrl, oRequestBody);
                    } else {
                        this.getController().byId("resourceStatusPanel").setBusy(false);
                        MessageToast.show("Status is unchanged.");
                    }
                }
            });
        }
    })
});