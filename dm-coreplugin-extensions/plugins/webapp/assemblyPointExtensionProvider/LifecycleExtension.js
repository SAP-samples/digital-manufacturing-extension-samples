sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.assemblyPointExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._bInitialized = false;
        },
     
        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING_PLUGIN) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_AFTER_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_EXIT) {
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
            return LifecycleConstants.EXTENSION_NAME;
        },

        onBeforeRendering: function(oEvent){
            if (!this._bInitialized) {
                let oConfiguration = this.getController().getConfiguration();
                if (oConfiguration) {
                    if (typeof oConfiguration.clearMainInput !== "undefined") {
                        this._oExtensionUtilities.setClearMainInputField(oConfiguration.clearMainInput);
                    } else {
                        this._oExtensionUtilities.setClearMainInputField(true);
                    }
                    if (typeof oConfiguration.logToConsole !== "undefined") {
                        this._oExtensionUtilities.setLogToConsole(oConfiguration.logToConsole);
                    } else {
                        this._oExtensionUtilities.setLogToConsole(false);
                    }
                }
            }
            this._oExtensionUtilities.setAllAssembled(false);
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: Assembly extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: Assembly extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: Assembly extension");
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: Assembly extension");
        },
    })
});
