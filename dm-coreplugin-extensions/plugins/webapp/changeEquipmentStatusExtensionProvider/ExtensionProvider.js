sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/changeEquipmentStatusExtensionProvider/PluginEventExtension",
    "sap/example/plugins/changeEquipmentStatusExtensionProvider/PluginLifecycleExtension",
    "sap/example/plugins/changeEquipmentStatusExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/changeEquipmentStatusExtensionProvider/ExtensionUtilities"
], function (PluginExtensionProvider, PluginEventExtension, PluginLifecycleExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.changeEquipmentStatusExtensionProvider.ExtensionProvider", {
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