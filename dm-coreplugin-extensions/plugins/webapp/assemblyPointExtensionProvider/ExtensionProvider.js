 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/assemblyPointExtensionProvider/LifecycleExtension",
    "sap/example/plugins/assemblyPointExtensionProvider/PluginEventExtension",
    "sap/example/plugins/assemblyPointExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/assemblyPointExtensionProvider/ExtensionUtilities",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.assemblyPointExtensionProvider.ExtensionProvider", {
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
