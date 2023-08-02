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

    return PluginControllerExtension.extend("sap.example.plugins.resourceStatusExtensionProvider.LifecycleExtension", {
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
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: ResourceStatus extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            let oConfiguration = this.getController().getConfiguration();
            let oTable = this.getController().getResourceStatusTable();

            if (oConfiguration && oConfiguration.showResourceId) {
                let oCell = new sap.m.Text({
                    text: "{resource}"
                });
                this._oExtensionUtilities.addColumnToTable(oTable, new sap.m.Column(), oCell, 0);
            }

            if (oConfiguration && oConfiguration.buttonHeight) {
                this._oExtensionUtilities.replaceListButtons(oTable, oConfiguration.buttonHeight, this.getController());
            }

            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: ResourceStatus extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: ResourceStatus extension");
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: ResourceStatus extension");
        },
    })
});
