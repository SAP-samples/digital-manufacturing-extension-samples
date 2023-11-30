 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/LifecycleExtension",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/PluginEventExtension",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },

        getExtensions: function () {
           return [
               new LifecycleExtension(this.oExtensionUtilities),
               new PluginEventExtension(this.oExtensionUtilities),
               new PropertyEditorExtension(this.oExtensionUtilities)
           ];
        }
    })
});
