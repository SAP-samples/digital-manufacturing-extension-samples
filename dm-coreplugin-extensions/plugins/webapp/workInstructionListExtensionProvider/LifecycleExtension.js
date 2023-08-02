sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/controller/extensions/LifecycleExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.workInstructionListExtensionProvider.LifecycleExtension", {
        constructor: function () {
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING_PLUGIN) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_AFTER_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_EXIT) {
                return OverrideExecution.After;
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

        onBeforeRendering: function () {
            console.log("WorkInstructionListPluginExtension.onBeforeRendering: I have been called!");
        },

        onBeforeRenderingPlugin: function () {
            console.log("WorkInstructionListPluginExtension.onBeforeRenderingPlugin: I have been called!");
        },

        onAfterRendering: function () {
            console.log("WorkInstructionListPluginExtension.onAfterRendering: I have been called!");
        },

        onExit: function () {
            console.log("WorkInstructionListPluginExtension.onExit: I have been called!");
        }
    });
});
