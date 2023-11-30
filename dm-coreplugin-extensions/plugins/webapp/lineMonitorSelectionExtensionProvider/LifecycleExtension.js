sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/filterbar/FilterGroupItem",
    "sap/m/Select",
    "sap/ui/core/Item"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, PluginEventConstants,
    JSONModel, FilterGroupItem, Select, Item) {
    "use strict";

    const oOverrideExecution = {
        onBeforeRendering:       OverrideExecution.After,
        onBeforeRenderingPlugin: OverrideExecution.After,
        onAfterRendering:        OverrideExecution.After,
        onExit:                  OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.LifecycleExtension", {
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

            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: LineMonitorSelection extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            let oConfiguration = this.getController().getConfiguration();

            let oFilterBar = this.getController().getLmSelectionFilterBar();
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

            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: LineMonitorSelection extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: LineMonitorSelection extension");
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: LineMonitorSelection extension");
        },
    })
});
