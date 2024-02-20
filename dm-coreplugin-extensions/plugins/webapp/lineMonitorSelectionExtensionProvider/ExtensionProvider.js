 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/LifecycleExtension",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/PluginEventExtension",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/lineMonitorSelectionExtensionProvider/ExtensionUtils",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtils, LogUtils) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtils = new ExtensionUtils();
            this.oLogUtils = new LogUtils();
        },

        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtils, this.oLogUtils);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtils, this.oLogUtils);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oLogUtils);

            this.oExtensionUtils.setPluginEventExtension(oPluginEventExtension);
            oLifecycleExtension.setPluginEventExtension(oPluginEventExtension);

            return [ oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension ];
        }
    })
});
