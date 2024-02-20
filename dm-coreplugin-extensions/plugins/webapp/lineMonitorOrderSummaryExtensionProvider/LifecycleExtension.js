sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/dm/dme/lmplugins/orderCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onBeforeRendering:       OverrideExecution.After,
        onBeforeRenderingPlugin: OverrideExecution.After,
        onAfterRendering:        OverrideExecution.After,
        onExit:                  OverrideExecution.After
    };

    function _removeFromArray(aArray, fnCondition) {
        const i = aArray.findIndex(fnCondition);
        if (i > -1) {
            aArray.splice(i, 1);
        }
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorOrderSummaryExtensionProvider.LifecycleExtension", {
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

                if (this.oConfiguration && this.oConfiguration.hasOwnProperty("extensionMode")){
                    this.extensionMode = this.oConfiguration.extensionMode;
                } else {
                    // default to "modify" mode if the configuration was never set in POD Designer
                    this.extensionMode = "MODIFY";
                }
                this._oPluginEventExtension.extensionMode = this.extensionMode;

                this._bInitialized = true;
            }

            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRendering: LineMonitorOrderSummary extension");
        },

        onBeforeRenderingPlugin: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: LineMonitorOrderSummary extension");
        },

        onAfterRendering: function(oEvent) {
            if (!this.bFirstRenderComplete) {
                const card = this.getCoreExtension().getCard();
                if (this.extensionMode === "MODIFY") {
                    this.getCoreExtension().getCardContentGroups().then(aGroups => {
                        // remove fields we don't care about
                        _removeFromArray(aGroups[0].items, (item) => item.value.includes("description"));
                        _removeFromArray(aGroups[1].items, (item) => item.value.includes("ActualCompletion"));

                        // add new fields
                        aGroups.push({
                            title: "Extension",
                            items: [
                                {
                                    label: "BOM",
                                    value: "{/content/BOM}"
                                },
                                {
                                    label: "Quantity Released",
                                    value: "{/content/QuantityReleased}"
                                },
                                {
                                    label: "Quantity Scrapped",
                                    value: "{/content/QuantityScrapped}"
                                }
                            ]
                        });
                        this.getCoreExtension().setCardContentGroups(aGroups);
                    });
                } else if (this.extensionMode === "REPLACE") {
                    this.getCoreExtension().setCardView("sap.example.plugins.lineMonitorOrderSummaryExtensionProvider.control.Extension");
                }

                this.bFirstRenderComplete = true;
            }
            this._oLogUtilities.logMessage("LifecycleExtension.onAfterRendering: LineMonitorOrderSummary extension");
        },

        onExit: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onExit: LineMonitorOrderSummary extension");
        }
    })
});
