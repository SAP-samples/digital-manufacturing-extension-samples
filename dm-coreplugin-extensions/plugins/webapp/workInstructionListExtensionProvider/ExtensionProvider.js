sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/workInstructionListExtensionProvider/LifecycleExtension",
    "sap/example/plugins/workInstructionListExtensionProvider/PluginEventExtension"
], function (PluginExtensionProvider, CreateExtension, PluginEventExtension) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.workInstructionListExtensionProvider.ExtensionProvider", {
        constructor: function () {
        },
        getExtensions: function () {
            return [
                new CreateExtension(),
                new PluginEventExtension()
            ];
        }
    });
});
