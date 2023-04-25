sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginPropertyEditorExtension"
], function (PluginPropertyEditorExtension) {
    "use strict";

    return PluginPropertyEditorExtension.extend("sap.example.plugins.assemblyPointExtensionProvider.PropertyEditorExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        /*
         * Function to override to add content before core properties
         *
         * @param {sap.ui.layout.form.SimpleForm} oPropertyFormContainer Form to add controls to
         * @param {object} oPropertyData Defined Property Data
         * @override
         */
        addPropertyEditorContentBefore: function (oPropertyFormContainer, oPropertyData) {
            let oPropertyEditor = this.getController();
            if (oPropertyEditor && oPropertyEditor.addSwitch) {
                let oSwitch = this.getController().addSwitch(oPropertyFormContainer, "clearMainInput", oPropertyData);
                let iIndex = oPropertyFormContainer.indexOfContent(oSwitch);
                let aContent = oPropertyFormContainer.getContent();
                let oLabel = null;
                if (aContent[iIndex-1].setText) {
                    oLabel = aContent[iIndex-1];
                    oLabel.setText("Clear Main Input Field");
                }
                oSwitch = this.getController().addSwitch(oPropertyFormContainer, "logToConsole", oPropertyData);
                iIndex = oPropertyFormContainer.indexOfContent(oSwitch);
                aContent = oPropertyFormContainer.getContent();
                if (aContent[iIndex-1].setText) {
                    oLabel = aContent[iIndex-1];
                    oLabel.setText("Log to console");
                }
            }
            return;
        },

        /*
         * Function to override to add content after core properties
         *
         * @param {sap.ui.layout.form.SimpleForm} oPropertyFormContainer Form to add controls to
         * @param {object} oPropertyData Defined Property Data
         * @override
         */
        addPropertyEditorContentAfter: function (oPropertyFormContainer, oPropertyData) {
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.addPropertyEditorContentAfter: hi");
            return;
        },

        /*
         * Function to override to add custom default property values to core property data
         *
         * @param {object} oPropertyData Defined Property Data
         * @returns {object} Updated Property Data
         * @override
         */
        getPropertyData: function (oPropertyData) {
            if (!oPropertyData) {
                oPropertyData = {};
            }
            if (typeof oPropertyData.clearMainInput === "undefined") {
                oPropertyData.clearMainInput = true;
            }
            if (typeof oPropertyData.logToConsole === "undefined") {
                oPropertyData.logToConsole = false;
            }
            return oPropertyData;
        },

        /*
         * Function to override to add custom default property values to core property data
         *
         * @param {object} oPropertyData Defined Property Data
         * @returns {object} Updated Property Data
         * @override
         */
        setPropertyData: function (oPropertyData) {
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.setPropertyData: hi");
            return oPropertyData;
        },

        /*
         * Function to override to add custom default property values
         *
         * @param {object} oPropertyData Defined Property Data
         * @returns {object} Updated Property Data
         * @override
         */
        getDefaultPropertyData: function (oPropertyData) {
            oPropertyData.clearMainInput = true;
            oPropertyData.logToConsole = false;
            return oPropertyData;
        }
    })
});
