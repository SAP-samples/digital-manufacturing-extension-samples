sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/base/util/uid"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, uid) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.sfcCardExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities, oSfcCardUtility) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oSfcCardUtility = oSfcCardUtility;
            this._bInitialized = false;
            this._bRendered = false;
            this._sInstanceId = uid();
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
                this._oSfcCardUtility.getPluginEventExtension().updateCustomData();
                this._bInitialized = true;
            }
            let sPluginId = "";
            if (this.getController()) {
                sPluginId = this.getController().getPluginId();
            }
            let sIdInfo = "Plugin ID = '" + sPluginId + "', instance id = " + this._sInstanceId;
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: SFC Card extension - " + sIdInfo);
        },

        onBeforeRenderingPlugin: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: SFC Card extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: SFC Card extension");
            if (this._bRendered) {
                // already rendered, exit
                return;
            }
            this._bRendered = true;
            let bShowHelp = this._oSfcCardUtility.getConfigurationValue("showHelp");
            if (typeof bShowHelp !== "boolean") {
                bShowHelp = true;
            }
            let bShowSupplier = this._oSfcCardUtility.getConfigurationValue("showSupplier");
            if (typeof bShowSupplier !== "boolean") {
                bShowSupplier = true;
            }
            if (!bShowHelp && !bShowSupplier) {
                return;
            }
            let that = this;
            setTimeout(function() {
                // delay to allow core view to render before modifying
                that._oSfcCardUtility.loadHeaderInformation(bShowHelp, bShowSupplier);
            }, 2000);
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: SFC Card extension");
        },
    })
});
