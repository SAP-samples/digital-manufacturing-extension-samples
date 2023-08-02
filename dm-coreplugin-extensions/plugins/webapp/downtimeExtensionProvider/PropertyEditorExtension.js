sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginPropertyEditorExtension"
], function (PluginPropertyEditorExtension) {
    "use strict";

    return PluginPropertyEditorExtension.extend("sap.example.plugins.downtimeExtensionProvider.PropertyEditorExtension", {
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
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.addPropertyEditorContentBefore: called");
        },

        /*
         * Function to override to add content after core properties
         *
         * @param {sap.ui.layout.form.SimpleForm} oPropertyFormContainer Form to add controls to
         * @param {object} oPropertyData Defined Property Data
         * @override
         */
        addPropertyEditorContentAfter: function (oPropertyFormContainer, oPropertyData) {
            let oPropertyEditor = this.getController();

            let oInput = this.getController().addInputField(oPropertyFormContainer, "downtimeListButtonHeight", oPropertyData);
            let oSwitch = this.getController().addSwitch(oPropertyFormContainer, "logToConsole", oPropertyData);

            let aContent = oPropertyFormContainer.getContent();

            // set labels for the new controls
            let iIndex = oPropertyFormContainer.indexOfContent(oInput);
            if (aContent[iIndex-1].setText) {
                let oLabel = aContent[iIndex-1];
                oLabel.setText("Downtime List Button Height");
            }

            iIndex = oPropertyFormContainer.indexOfContent(oSwitch);
            if (aContent[iIndex-1].setText) {
                let oLabel = aContent[iIndex-1];
                oLabel.setText("Enable debug logging");
            }
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
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.setPropertyData: called");
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
            oPropertyData.logToConsole = false;
            oPropertyData.downtimeListButtonHeight = "48px";
            return oPropertyData;
        }
    })
});
