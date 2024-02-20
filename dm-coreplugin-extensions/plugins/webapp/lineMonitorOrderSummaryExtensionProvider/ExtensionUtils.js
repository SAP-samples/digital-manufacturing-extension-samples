sap.ui.define([
    "sap/ui/base/Object",
    "sap/dm/dme/lmplugins/orderCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (BaseObject, Constants) {
    "use strict";

    return BaseObject.extend("sap.example.plugins.lineMonitorOrderSummaryExtensionProvider.ExtensionUtils", {
        setPluginEventExtension: function (oPluginEventExtension) {
            this._oPluginEventExtension = oPluginEventExtension;
        },

        getCoreExtension: function() {
            return this._oPluginEventExtension.getCoreExtension();
        }
    });
});