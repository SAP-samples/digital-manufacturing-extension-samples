 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/sfcCardExtensionProvider/LifecycleExtension",
    "sap/example/plugins/sfcCardExtensionProvider/PluginEventExtension",
    "sap/example/plugins/sfcCardExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities",
    "sap/example/plugins/sfcCardExtensionProvider/SfcCardUtility"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities, SfcCardUtility) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.sfcCardExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
            this.oSfcCardUtility = new SfcCardUtility();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities, this.oSfcCardUtility);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            this.oSfcCardUtility.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
