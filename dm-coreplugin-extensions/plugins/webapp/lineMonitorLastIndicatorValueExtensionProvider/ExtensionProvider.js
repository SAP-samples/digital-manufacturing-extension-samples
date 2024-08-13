sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/lineMonitorLastIndicatorValueExtensionProvider/PluginEventExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, PluginEventExtension, ExtensionUtilities) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.lineMonitorLastIndicatorValueExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },

        getExtensions: function () {
            const oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            return [ oPluginEventExtension ];
        }
    })
});
