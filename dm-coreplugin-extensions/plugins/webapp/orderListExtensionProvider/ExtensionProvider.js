 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/orderListExtensionProvider/CreateExtension",
    "sap/example/plugins/orderListExtensionProvider/LifecycleExtension",
    "sap/example/plugins/orderListExtensionProvider/PluginEventExtension",
    "sap/example/plugins/orderListExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, CreateExtension, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.orderListExtensionProvider.ExtensionProvider", {
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
