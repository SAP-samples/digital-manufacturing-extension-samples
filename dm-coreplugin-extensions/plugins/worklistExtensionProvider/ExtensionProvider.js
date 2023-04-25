 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/worklistExtensionProvider/CreateExtension",
    "sap/example/plugins/worklistExtensionProvider/LifecycleExtension",
    "sap/example/plugins/worklistExtensionProvider/PluginEventExtension",
    "sap/example/plugins/worklistExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, CreateExtension, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.worklistExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },
        getExtensions: function () {
           return [
               new CreateExtension(this.oExtensionUtilities),
               new LifecycleExtension(this.oExtensionUtilities),
               new PluginEventExtension(this.oExtensionUtilities),
               new PropertyEditorExtension(this.oExtensionUtilities)
           ];
        }
    })
});
