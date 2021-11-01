sap.ui.define([
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function(PropertyEditor) {
    "use strict";

    var oPropertyEditor = PropertyEditor.extend("sap.ext.exampleplugins.exampleExecutionPlugin.builder.PropertyEditor", {
        constructor : function(sId, mSettings) {
            PropertyEditor.apply(this, arguments);
            this.setI18nKeyPrefix("exampleExecutionPlugin.");
            this.setResourceBundleName("sap.ext.exampleplugins.exampleExecutionPlugin.i18n.builder");
            this.setPluginResourceBundleName("sap.ext.exampleplugins.exampleExecutionPlugin.i18n.i18n");
        },

        addPropertyEditorContent : function(oPropertyFormContainer) {
            var oData = this.getPropertyData();
            this._oActionButtonSelect = this.initializedActionButtons(oPropertyFormContainer, "actionButtonId", oData);
            this.addSwitch(oPropertyFormContainer, "synchronous", oData);
        },

        getDefaultPropertyData : function() {
            var oData = {
                "actionButtonId": "",
                "synchronous": true
            };

            return oData;
        }
    });

    return oPropertyEditor;
});