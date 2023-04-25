 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/guidedStepsExtensionProvider/LifecycleExtension",
    "sap/example/plugins/guidedStepsExtensionProvider/PluginEventExtension",
    "sap/example/plugins/guidedStepsExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, PropertyEditorExtension) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.guidedStepsExtensionProvider.ExtensionProvider", {
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
