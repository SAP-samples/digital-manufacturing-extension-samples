sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginPropertyEditorExtension"
], function (PluginPropertyEditorExtension) {
    "use strict";

    return PluginPropertyEditorExtension.extend("sap.example.plugins.lineMonitorShiftProgressExtensionProvider.PropertyEditorExtension", {
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
            const oPropertyEditor = this.getController();

            const aControls = [
                {
                    control: this.getController().addSwitch(oPropertyFormContainer, "logToConsole", oPropertyData),
                    label: "Extension debug logging"
                }
            ];

            // set labels for the new controls
            const aContent = oPropertyFormContainer.getContent();
            for (const oControl of aControls) {
                const iLabelIndex = oPropertyFormContainer.indexOfContent(oControl.control) - 1;
                if (typeof(aContent[iLabelIndex].setText) === "function") {
                    const oLabel = aContent[iLabelIndex];
                    oLabel.setText(oControl.label);
                }
            }

            this._oExtensionUtilities.logMessage("PropertyEditorExtension.addPropertyEditorContentAfter: called");
        },

        /*
         * Function to override to add custom default property values to core property data
         *
         * @param {object} oPropertyData Defined Property Data
         * @returns {object} Updated Property Data
         * @override
         */
        getPropertyData: function (oPropertyData) {
            oPropertyData = oPropertyData || {};
            const oDefaults = this.getDefaultPropertyData();

            // for each property with a default value, apply that default to oPropertyData if it is not already defined
            for (const sProp in oDefaults) {
                if (typeof(oPropertyData[sProp]) === "undefined") {
                    oPropertyData[sProp] = oDefaults[sProp];
                }
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
            oPropertyData = oPropertyData || {};
            return Object.assign(oPropertyData, {
                logToConsole: false
            });
        }
    })
});
