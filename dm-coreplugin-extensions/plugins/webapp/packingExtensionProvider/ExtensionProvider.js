sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/packingExtensionProvider/PluginEventExtension",
    "sap/example/plugins/packingExtensionProvider/LifecycleExtension",
    "sap/example/plugins/packingExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/packingExtensionProvider/CreateExtension"
], function (PluginExtensionProvider, PluginEventExtension, LifecycleExtension, PropertyEditorExtension, CreateExtension) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.packingExtensionProvider.ExtensionProvider", {
        constructor: function () {
        },
        getExtensions: function () {
            return [
                new PluginEventExtension(),
                new LifecycleExtension(),
                new PropertyEditorExtension(),
                new CreateExtension()
            ];
        }
    });
});
