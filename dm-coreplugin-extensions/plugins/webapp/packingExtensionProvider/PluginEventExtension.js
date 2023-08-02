sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/packingplugins/packingPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/dm/dme/podfoundation/util/PodUtility",
    "sap/ndc/BarcodeScannerButton",
    "sap/m/MessageToast"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.packingExtensionProvider.PluginEventExtension", {
        constructor: function () {
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_PACKING_UNIT_CHANGE_EVENT) {
                return OverrideExecution.Before;
            } else if (sOverrideMember === PluginEventConstants.ON_PACK_PRESS_EVENT) {
                return OverrideExecution.Before;
            } else if (sOverrideMember === PluginEventConstants.ON_UNPACK_PRESS_EVENT) {
                return OverrideExecution.Before;
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
            return PluginEventConstants.EXTENSION_NAME;
        },

        /**
         * Used to react to the Packing Unit Change Event.
         * This event is triggered when the core plugin is about to issue a Packing Unit REST PUT call.
         * Override it as Before, After or Instead.
         * If Instead is used, then make sure to call
         * this.getController().getView().setBusy(false);
         * to unlock the core UI.
         * @param { oPackingUnit } full Packing Unit payload object used in REST Calls
         * @returns { Promise } resolves when event processing is complete.
         */
        onPackingUnitChangeEvent: function ({ oPackingUnit }) {
            // Unlock the UI if the event handler is configured Instead.
            this.getController().setUnitsListViewBusy(false);
            console.log(`Hey! onPackingUnitChangeEvent has been extended by the external plugin!. It got such arguments:`, oPackingUnit);
            return Promise.resolve();
        },

        /**
         * Used to react to the Pack button press Event.
         */
        onPackPressEvent: function () {
            console.log("Hey! The PACK button event handler was processed by the extension!");
        },

        /**
         * Used to react to the UnPack button press Event.
         */
        onUnpackPressEvent: function () {
            console.log("Hey! The UNPACK button event handler was processed by the extension!");
        }
    });
});
