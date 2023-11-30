 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/wcPodSelectionExtensionProvider/LifecycleExtension",
    "sap/example/plugins/wcPodSelectionExtensionProvider/PluginEventExtension",
    "sap/example/plugins/wcPodSelectionExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities",
    "sap/example/plugins/utils/PodSelectionExtensionUtility"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities, ExtensionUtility) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.wcPodSelectionExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
            this.oExtensionUtility = new ExtensionUtility();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities, this.oExtensionUtility);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities, this.oExtensionUtility);
            this.oExtensionUtility.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
