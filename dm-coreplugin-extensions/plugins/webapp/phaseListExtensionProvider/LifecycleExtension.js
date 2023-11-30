sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.phaseListExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities, oPhaseListUtility) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oPhaseListUtility = oPhaseListUtility;
            this._bInitialized = false;
            this._bRendered = false;
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
                    if (typeof oConfiguration.logToConsole !== "undefined") {
                        this._oExtensionUtilities.setLogToConsole(oConfiguration.logToConsole);
                    } else {
                        this._oExtensionUtilities.setLogToConsole(false);
                    }
                }
                this._bInitialized = true;
            }
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: Phase List extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: Phase List extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: Phase List extension");
            if (this._bRendered) {
                // already rendered, exit
                return;
            }
            this._bRendered = true;
            let bShowHelp = this._oPhaseListUtility.getConfigurationValue("showHelp");
            if (typeof bShowHelp !== "boolean") {
                bShowHelp = true;
            }
            let bShowCustomColumn = this._oPhaseListUtility.getConfigurationValue("showCustomColumn");
            if (typeof bShowCustomColumn !== "boolean") {
                bShowCustomColumn = true;
            }
            if (!bShowHelp && !bShowCustomColumn) {
                return;
            }
            let that = this;
            setTimeout(function() {
                // delay to allow core view to render before modifying
                that._oPhaseListUtility.loadCustomInformation(bShowHelp, bShowCustomColumn);
            }, 2000);
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: Phase List extension");
        }
    })
});
