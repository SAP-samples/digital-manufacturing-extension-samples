sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginPropertyEditorExtension"
], function (PluginPropertyEditorExtension) {
    "use strict";

    return PluginPropertyEditorExtension.extend("sap.example.plugins.guidedStepsExtensionProvider.PropertyEditorExtension", {
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
            // to be implemented by sub-classes
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.addPropertyEditorContentBefore: hi");
            var oPropertyEditor = this.getController();
            if (oPropertyEditor && oPropertyEditor.addSwitch) {
                var oSwitch = this.getController().addSwitch(oPropertyFormContainer, "acknowledgeCompletion", oPropertyData);
                var iIndex = oPropertyFormContainer.indexOfContent(oSwitch);
                var aContent = oPropertyFormContainer.getContent();
                if (aContent[iIndex-1].setText) {
                    var oLabel = aContent[iIndex-1];
                    oLabel.setText("Acknowledge Completion");
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
            // to be implemented by sub-classes
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
            if (typeof oPropertyData.acknowledgeCompletion === "undefined") {
                oPropertyData.acknowledgeCompletion = true;
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
            // to be implemented by sub-classes
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
            // to be implemented by sub-classes
            this._oExtensionUtilities.logMessage("PropertyEditorExtension.getDefaultPropertyData: hi");
            oPropertyData.acknowledgeCompletion = true;
            return oPropertyData;
        }
    })
});
