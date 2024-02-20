 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/orderCardExtensionProvider/LifecycleExtension",
    "sap/example/plugins/orderCardExtensionProvider/PluginEventExtension",
    "sap/example/plugins/orderCardExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities",
    "sap/example/plugins/orderCardExtensionProvider/OrderCardUtility"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities, OrderCardUtility) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.orderCardExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
            this.oOrderCardUtility = new OrderCardUtility();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities, this.oOrderCardUtility);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            this.oOrderCardUtility.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
