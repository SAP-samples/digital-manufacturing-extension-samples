sap.ui.define([
    "sap/ui/base/Object",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/extensions/PluginEventExtensionConstants"
], function (BaseObject, Constants) {
    "use strict";

    const EXECUTION_STATUS_ACTIVE = "ACTIVE";

    function compareActualStart(a, b) {
        return a.actualStart.localeCompare(b.actualStart);
    };

    return BaseObject.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.ExtensionUtils", {
        setPluginEventExtension: function (oPluginEventExtension) {
            this._oPluginEventExtension = oPluginEventExtension;
        },

        getCoreExtension: function() {
            return this._oPluginEventExtension.getCoreExtension();
        },

        // TODO: document a public function for this
        isOrderSelectionType: function(oController) {
            return oController.getConfiguration().selectionFilterType === "Order";
        },

        getCurrentOrder: function() {
            return new Promise((fnResolve, fnReject) => {
                this.getCoreExtension().getOrdersForCurrentWorkCenter().then((aOrders) => {
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
        }
    });
});