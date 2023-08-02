sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/dm/dme/wiplugins/workInstructionViewPlugin/controller/extensions/CreateExtensionConstants",
    "sap/ui/core/mvc/OverrideExecution"
], function (PluginControllerExtension, CreateConstants, OverrideExecution) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.wiplugins.workinstructionviewer.CreateExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === CreateConstants.SHOW_WORK_INSTRUCTION) {
                return OverrideExecution.Instead;
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
            return CreateConstants.EXTENSION_NAME;
        },

        showWorkInstruction: function ({ oWiData }) {
            window.open(`https://www.google.com/search?q=${oWiData.text}`);
        }
    });
});
