sap.ui.define([
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function(PropertyEditor) {
    "use strict";

    var oPropertyEditor = PropertyEditor.extend("vendor.ext.executionplugins.exampleExecutionPlugin.builder.PropertyEditor", {
        constructor : function(sId, mSettings) {
            PropertyEditor.apply(this, arguments);
            this.setI18nKeyPrefix("exampleExecutionPlugin.");
            this.setResourceBundleName("vendor.ext.executionplugins.exampleExecutionPlugin.i18n.builder");
            this.setPluginResourceBundleName("vendor.ext.executionplugins.exampleExecutionPlugin.i18n.i18n");
        },

        addPropertyEditorContent : function(oPropertyFormContainer) {
            var oData = this.getPropertyData();
            this.initializedActionButtons(oPropertyFormContainer, "actionButtonIdForStart", oData);
            this.initializedActionButtons(oPropertyFormContainer, "actionButtonIdForComplete", oData);
            this.addSwitch(oPropertyFormContainer, "synchronous", oData);
            this.addSelect(oPropertyFormContainer, "operationFilterCriteria", oData, ["All operations","Operation is","Operation is one of"]);
            this.addInputField(oPropertyFormContainer, "operation", oData);
        },

        getTitle : function() {
            return this.getI18nText("title");
        },

        hasConfigurationProperties: function () {
            return true;
        },

        getDefaultPropertyData : function() {
            var oData = {
                "actionButtonIdForStart": "",
                "actionButtonIdForComplete": "",
                "synchronous": true,
                "operationFilterCriteria": "All operations",
                "operation": ""
            };

            return oData;
        },

        handleInputChange : function (sDataFieldName, sValue, oSource) {
            var oData = this.getPropertyData();
            var isValid = this.validateInputRegEx(sValue);
            if(!isValid) {
                oSource.setValueState(sap.ui.core.ValueState.Error);
                oSource.setValueStateText(this.getI18nText("exampleExecutionPlugin.invalidCharcName"));
            }
            else {
                oData[sDataFieldName] = sValue;
                oSource.setValueState(sap.ui.core.ValueState.None);
                oSource.setValueStateText("");
            }
        },

        validateInputRegEx: function (sInputValue) {
            //Regex for Valid Characters
            var regex = /^[A-Z0-9_@,\-. ]+$/; 
            var isValidInput = true;
            if (sInputValue) {
                if (!sInputValue.match(regex)) {
                    isValidInput = false;
                }
            }
            return isValidInput;
        }
    });

    return oPropertyEditor;
});