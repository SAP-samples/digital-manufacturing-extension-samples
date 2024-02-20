 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/phaseDetailExtensionProvider/LifecycleExtension",
    "sap/example/plugins/phaseDetailExtensionProvider/PluginEventExtension",
    "sap/example/plugins/phaseDetailExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities",
    "sap/example/plugins/phaseDetailExtensionProvider/PhaseDetailUtility"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities, PhaseDetailUtility) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.phaseDetailExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
            this.oPhaseDetailUtility = new PhaseDetailUtility();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities, this.oPhaseDetailUtility);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            this.oPhaseDetailUtility.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
