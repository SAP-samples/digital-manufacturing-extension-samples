 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/lineMonitorYieldAndScrapExtensionProvider/LifecycleExtension",
    "sap/example/plugins/lineMonitorYieldAndScrapExtensionProvider/PluginEventExtension",
    "sap/example/plugins/lineMonitorYieldAndScrapExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/lineMonitorYieldAndScrapExtensionProvider/ExtensionUtils",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, PropertyEditorExtension, ExtensionUtils, LogUtils) {
    "use strict";

    return PluginExtensionProvider.extend("sap.example.plugins.lineMonitorYieldAndScrapExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtils = new ExtensionUtils();
            this.oLogUtils = new LogUtils();
        },

        getExtensions: function () {
            const oLifecycleExtension = new LifecycleExtension(this.oExtensionUtils, this.oLogUtils);
            const oPluginEventExtension = new PluginEventExtension(this.oExtensionUtils, this.oLogUtils);
            const oPropertyEditorExtension = new PropertyEditorExtension(this.oLogUtils);

            // make public functions available to utils and lifecycle extension
            this.oExtensionUtils.setPluginEventExtension(oPluginEventExtension);
            oLifecycleExtension.setPluginEventExtension(oPluginEventExtension);

            return [ oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension ];
        }
    })
});
