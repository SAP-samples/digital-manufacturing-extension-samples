 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "sap/example/plugins/phaseListExtensionProvider/LifecycleExtension",
    "sap/example/plugins/phaseListExtensionProvider/PluginEventExtension",
    "sap/example/plugins/phaseListExtensionProvider/PropertyEditorExtension",
    "sap/example/plugins/utils/ExtensionUtilities",
    "sap/example/plugins/phaseListExtensionProvider/PhaseListUtility"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities, PhaseListUtility) {
    "use strict";
    return PluginExtensionProvider.extend("sap.example.plugins.phaseListExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
            this.oPhaseListUtility = new PhaseListUtility();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities, this.oPhaseListUtility);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            this.oPhaseListUtility.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
