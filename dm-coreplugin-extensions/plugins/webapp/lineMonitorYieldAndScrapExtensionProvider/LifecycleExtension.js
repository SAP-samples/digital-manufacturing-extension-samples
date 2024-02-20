sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/dm/dme/lmplugins/yieldAndScrapTableCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onBeforeRendering:       OverrideExecution.After,
        onBeforeRenderingPlugin: OverrideExecution.After,
        onAfterRendering:        OverrideExecution.After,
        onExit:                  OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorYieldAndScrapExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities, oLogUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oLogUtilities = oLogUtilities;
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

        setPluginEventExtension: function (oPluginEventExtension) {
            this._oPluginEventExtension = oPluginEventExtension;
        },

        getCoreExtension: function() {
            return this._oPluginEventExtension.getCoreExtension();
        },

        onBeforeRendering: function(oEvent) {
            if (!this._bInitialized) {
                this.oConfiguration = this.getController().getConfiguration();
                if (this.oConfiguration && this.oConfiguration.hasOwnProperty("logToConsole")) {
                    this._oLogUtilities.setLogToConsole(this.oConfiguration.logToConsole);
                } else {
                    this._oLogUtilities.setLogToConsole(false);
                }

                this._bInitialized = true;
            }

            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRendering: LineMonitorYieldAndScrap extension");
        },

        onBeforeRenderingPlugin: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: LineMonitorYieldAndScrap extension");
        },

        onAfterRendering: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onAfterRendering: LineMonitorYieldAndScrap extension");
        },

        onExit: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onExit: LineMonitorYieldAndScrap extension");
        }
    })
});
