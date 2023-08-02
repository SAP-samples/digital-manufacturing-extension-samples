sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/workInstructionViewerExtensionProvider/CreateExtension"
], function (PluginExtensionProvider, CreateExtension) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.workInstructionViewerExtensionProvider.ExtensionProvider", {
        constructor: function () {
        },
        getExtensions: function () {
            return [
                new CreateExtension()
            ];
        }
    });
});
