sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/downtimeExtensionProvider/PluginEventExtension",
    "sap/example/plugins/downtimeExtensionProvider/PluginLifecycleExtension",
    "sap/example/plugins/downtimeExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/downtimeExtensionProvider/ExtensionUtilities"
], function (PluginExtensionProvider, PluginEventExtension, PluginLifecycleExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.downtimeExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },
        getExtensions: function () {
           return [
               new PluginEventExtension(this.oExtensionUtilities),
               new PluginLifecycleExtension(this.oExtensionUtilities),
               new PropertyEditorExtension(this.oExtensionUtilities)
           ];
        }
    })
});