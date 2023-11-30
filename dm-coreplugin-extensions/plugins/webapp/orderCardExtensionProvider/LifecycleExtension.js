sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.orderCardExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities, oOrderCardUtility) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oOrderCardUtility = oOrderCardUtility;
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
                this._oOrderCardUtility.getPluginEventExtension().updateCustomData();
                this._bInitialized = true;
            }
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: Order Details extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            this.getController().subscribe("PageChangeEvent", this.onPageChangeEvent, this);
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: Order Details extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: Order Details extension");
            if (this._bRendered) {
                // already rendered, exit
                return;
            }
            this._bRendered = true;
            let bShowHelp = this._oOrderCardUtility.getConfigurationValue("showHelp");
            if (typeof bShowHelp !== "boolean") {
                bShowHelp = true;
            }
            let bShowSupplier = this._oOrderCardUtility.getConfigurationValue("showSupplier");
            if (typeof bShowSupplier !== "boolean") {
                bShowSupplier = true;
            }
            if (!bShowHelp && !bShowSupplier) {
                return;
            }
            let that = this;
            setTimeout(function() {
                // delay to allow core view to render before modifying
                that._oOrderCardUtility.loadHeaderInformation(bShowHelp, bShowSupplier);
            }, 2000);
        },

        onExit: function(oEvent){
            this.getController().unsubscribe("PageChangeEvent", this.onPageChangeEvent, this);
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: Order Details extension");
        },

        onPageChangeEvent: function(oEvent){
            this._oOrderCardUtility.getPluginEventExtension().updateCustomData();
            this._oExtensionUtilities.logMessage("LifecycleExtension.onPageChangeEvent: Order Details extension");
        }
    })
});
