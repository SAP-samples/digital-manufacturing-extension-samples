sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";

    return PropertyEditor.extend("sap.ext.exampleplugins.exampleWip.builder.PropertyEditor", {
        constructor: function (sId, mSettings) {
            PropertyEditor.apply(this, arguments);
            this.setI18nKeyPrefix("exampleWipPluginConfig.");
            this.setResourceBundleName("sap.ext.exampleplugins.exampleWip.i18n.builder");
            this.setPluginResourceBundleName("sap.ext.exampleplugins.exampleWip.i18n.i18n");
        },

        addPropertyEditorContent: function (oPropertyFormContainer) {
            var oData = this.getPropertyData();
            this.addSwitch(oPropertyFormContainer, "backButtonVisible", oData);
            this.addSwitch(oPropertyFormContainer, "closeButtonVisible", oData);
        },

        handleSwitchChange: function (sDataName, bSelected) {
            var oData = this.getPropertyData();
            oData[sDataName] = bSelected;
        },

        getDefaultPropertyData: function () {
            return {
                "backButtonVisible": false,
                "closeButtonVisible": false
            };
        },
    });
});
