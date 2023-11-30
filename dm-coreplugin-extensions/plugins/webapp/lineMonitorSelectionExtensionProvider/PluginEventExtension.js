sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Filter, FilterOperator, FilterType, Sorter) {
    "use strict";

    const oOverrideExecution = {
        onGetCurrentOrder: OverrideExecution.Instead,
        onOrderSelectDialogOpen: OverrideExecution.Before
    };

    const EXECUTION_STATUS_ACTIVE = "ACTIVE";

    function compareActualStart(a, b) {
        return a.actualStart.localeCompare(b.actualStart);
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (oOverrideExecution.hasOwnProperty(sOverrideMember)) {
                return oOverrideExecution[sOverrideMember];
            }
            return null;
        },

        getExtensionName: function() {
            return PluginEventConstants.EXTENSION_NAME;
        },

        onGetCurrentOrder: function() {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onGetCurrentOrder: called");

            return new Promise((fnResolve, fnReject) => {
                this.getController().getOrdersForCurrentWorkCenter().then((aOrders) => {
                    if (!aOrders.length) {
                        // no orders for current work center, or no work center selected
                        fnResolve();
                        return;
                    }

                    // select from active orders, unless there aren't any
                    let aActiveOrders = aOrders.filter((oOrder) => oOrder.executionStatus === EXECUTION_STATUS_ACTIVE);
                    if (aActiveOrders.length) {
                        aOrders = aActiveOrders;
                    }

                    fnResolve(aOrders.sort(compareActualStart)[0].mfgOrder);
                }).catch(fnReject);
            });
        },

        /**
         * Filtering and sorting must be done in an OData-friendly way to use the existing binding.
         * For more in-depth customization, create and use a non-OData model (oDialog.bindItems(oJsonModel)), then
         *    fetch all orders with this.getController().getOrders() and filter/sort everything client-side.
         */
        onOrderSelectDialogOpen: function(oDialog) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOrderSelectDialogOpen: called");

            let oBinding = oDialog.getBinding("items");

            // the custom dropdown added in LifecycleExtension lets us filter to ACTIVE or show every order regardless of execution status
            let oSelectFromOrders = this.getController().getLmSelectionFilterBar().determineControlByName("selectFromOrders");
            if (oSelectFromOrders.getSelectedKey() === EXECUTION_STATUS_ACTIVE) {
                oBinding.filter([
                    ...oBinding.getFilters(FilterType.Application),
                    new Filter({
                        path: "executionStatus",
                        operator: FilterOperator.EQ,
                        value1: EXECUTION_STATUS_ACTIVE
                    })
                ]);
            }

            oBinding.sort([
                new Sorter({
                    path: "actualStart",
                    descending: false,
                })
            ]);
        }
    })
});
