sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/Constants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, PluginEventConstants,
    JSONModel, FilterGroupItem, Select, Item, LMSelectionConstants) {
    "use strict";

    const oOverrideExecution = {
        onBeforeRendering:       OverrideExecution.After,
        onBeforeRenderingPlugin: OverrideExecution.After,
        onAfterRendering:        OverrideExecution.After,
        onExit:                  OverrideExecution.After
    };

    let bRefreshEnabled;
    let iRefreshIntervalMillis;

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.LifecycleExtension", {
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
                let oConfiguration = this.getController().getConfiguration();
                if (oConfiguration && oConfiguration.hasOwnProperty("logToConsole")) {
                    this._oLogUtilities.setLogToConsole(oConfiguration.logToConsole);
                } else {
                    this._oLogUtilities.setLogToConsole(false);
                }
                this._bInitialized = true;
            }

            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRendering: LineMonitorSelection extension");
        },

        onBeforeRenderingPlugin: function(oEvent) {
            this._oLogUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: LineMonitorSelection extension");
        },

        onAfterRendering: function(oEvent) {
            // this.getCoreExtension is not defined during onBeforeRenderingPlugin
            if (!this.bFirstRenderComplete) {
                let oFilterBar = this.getCoreExtension().getLmSelectionFilterBar();
                oFilterBar.addFilterGroupItem(new FilterGroupItem({
                    name: "selectFromOrders",
                    groupName: "EXTENSION",
                    label: "Select order from",
                    control: new Select({
                        selectedKey: "ACTIVE",
                        items: [
                            new Item({
                                text: "Active orders only",
                                key: "ACTIVE"
                            }),
                            new Item({
                                text: "All orders for the selected work center",
                                key: "ALL"
                            })
                        ]
                    }),
                    visibleInFilterBar: PluginEventConstants.LM_IS_ORDER_FILTER_VISIBLE_PATH
                }));

                this.bFirstRenderComplete = true;
            }

            this._oLogUtilities.logMessage("LifecycleExtension.onAfterRendering: LineMonitorSelection extension");
        },

        onExit: function(oEvent) {
            this.clearRefreshTimer();

            this._oLogUtilities.logMessage("LifecycleExtension.onExit: LineMonitorSelection extension");
        }
    })
});
