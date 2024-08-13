 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/lineMonitorShiftProgressExtensionProvider/LifecycleExtension",
    "sap/example/plugins/lineMonitorShiftProgressExtensionProvider/PluginEventExtension",
    "sap/example/plugins/lineMonitorShiftProgressExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtilities) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.lineMonitorShiftProgressExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },

        getExtensions: function () {
            const oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities);
            const oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            const oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);

            // make public functions available to lifecycle extension
            oLifecycleExtension.setPluginEventExtension(oPluginEventExtension);

            return [ oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension ];
        }
    })
});
