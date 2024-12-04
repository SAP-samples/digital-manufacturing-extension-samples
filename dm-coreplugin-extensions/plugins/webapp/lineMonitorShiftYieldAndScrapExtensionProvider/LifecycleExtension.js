sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    const oOverrideExecution = {
        onBeforeRendering:       OverrideExecution.After,
        onBeforeRenderingPlugin: OverrideExecution.After,
        onAfterRendering:        OverrideExecution.After,
        onExit:                  OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorShiftYieldAndScrapExtensionProvider.LifecycleExtension", {
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
                    this._oExtensionUtilities.setLogToConsole(this.oConfiguration.logToConsole);
                } else {
                    this._oExtensionUtilities.setLogToConsole(false);
                }

                this._bInitialized = true;
            }

            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: LineMonitorShiftYieldAndScrap extension");
        },

        onBeforeRenderingPlugin: function(oEvent) {
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: LineMonitorShiftYieldAndScrap extension");
        },

        onAfterRendering: function(oEvent) {
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: LineMonitorShiftYieldAndScrap extension");
        },

        onExit: function(oEvent) {
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: LineMonitorShiftYieldAndScrap extension");
        }
    })
});
