sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/resourceStatus/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onFetchResourceStatusTableData: OverrideExecution.After,
        onOpenStatusChangeDialog: OverrideExecution.Before,
        onSaveResourceStatus: OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.resourceStatusExtensionProvider.PluginEventExtension", {
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

        onFetchResourceStatusTableData: function(sUrl, oQueryParams, oPromise) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFetchResourceStatusTableData: called");

            // oPromise is only provided when this function is called after the core function (OverrideExecution.After), otherwise it is null
            oPromise.finally(() => {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onFetchResourceStatusTableData: finished");
            });
        },

        onOpenStatusChangeDialog: function(oDialog) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOpenStatusChangeDialog: called");
        },

        onSaveResourceStatus: function(sUrl, oRequestBody, oPromise) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSaveResourceStatus: called");

            // oPromise is only provided when this function is called after the core function (OverrideExecution.After), otherwise it is null
            oPromise.finally(() => {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onFetchResourceStatusTableData: finished");
            });
        }
    })
});
