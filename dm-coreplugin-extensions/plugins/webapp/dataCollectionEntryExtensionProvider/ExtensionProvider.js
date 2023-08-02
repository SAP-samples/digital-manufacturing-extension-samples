 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/dataCollectionEntryExtensionProvider/LifecycleExtension",
    "sap/example/plugins/dataCollectionEntryExtensionProvider/PluginEventExtension",
    "sap/example/plugins/dataCollectionEntryExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.dataCollectionEntryExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },
        getExtensions: function () {
           return [
               new LifecycleExtension(this.oExtensionUtilities),
               new PluginEventExtension(this.oExtensionUtilities),
               new PropertyEditorExtension(this.oExtensionUtilities)
           ];
        }
    })
});
