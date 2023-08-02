sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    const oOverrideExecution = {};
    oOverrideExecution[LifecycleConstants.ON_BEFORE_RENDERING] = OverrideExecution.After;
    oOverrideExecution[LifecycleConstants.ON_BEFORE_RENDERING_PLUGIN] = OverrideExecution.After;
    oOverrideExecution[LifecycleConstants.ON_AFTER_RENDERING] = OverrideExecution.After;
    oOverrideExecution[LifecycleConstants.ON_EXIT] = OverrideExecution.After;

    return PluginControllerExtension.extend("sap.example.plugins.downtimeExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (oOverrideExecution.hasOwnProperty(sOverrideMember)) {
                return oOverrideExecution[sOverrideMember];
            }
            return null;
        },

        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return LifecycleConstants.EXTENSION_NAME;
        },

        onBeforeRendering: function(oEvent){
            if (!this._bInitialized) {
                let oConfiguration = this.getController().getConfiguration();
                if (oConfiguration && oConfiguration.hasOwnProperty("logToConsole")) {
                    this._oExtensionUtilities.setLogToConsole(oConfiguration.logToConsole);
                } else {
                    this._oExtensionUtilities.setLogToConsole(false);
                }
                this._bInitialized = true;
            }
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: Downtime extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            let sHeight = "";
            let oConfiguration = this.getController().getConfiguration();
            if (oConfiguration && oConfiguration.hasOwnProperty("downtimeListButtonHeight")) {
                sHeight = oConfiguration.downtimeListButtonHeight;
            }

            let oTable = this.getController().getDowntimeTable();
            this._oExtensionUtilities.replaceDowntimeListButtons(oTable, sHeight, this.getController());

            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: Downtime extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: Downtime extension");
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: Downtime extension");
        },
    })
});
