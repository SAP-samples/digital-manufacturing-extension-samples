sap.ui.define([
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (PropertyEditor) {
    "use strict";

    var oPropertyEditor = PropertyEditor.extend("vendor.ext.executionplugins.asynchExecutionPluginTemplate.builder.PropertyEditor", {
        constructor: function (sId, mSettings) {
            PropertyEditor.apply(this, arguments);
            this.setI18nKeyPrefix("asynchExecutionPluginTemplate.");
            this.setResourceBundleName("vendor.ext.executionplugins.asynchExecutionPluginTemplate.i18n.builder");
            this.setPluginResourceBundleName("vendor.ext.executionplugins.asynchExecutionPluginTemplate.i18n.i18n");
        },
        getTitle: function () {
            return this.getI18nText("title");
        },

        hasConfigurationProperties: function () {
            return false;
        }

    });

    return oPropertyEditor;
});