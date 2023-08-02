sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/wiplugins/workInstructionListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Dialog, Button, ButtonType, List, StandardListItem, JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.workInstructionListExtensionProvider.PluginEventExtension", {
        constructor: function () {
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_ITEM_PRESS_EVENT) {
                return OverrideExecution.Instead;
            }
            return null;
        },

        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        /**
         * Used to react to the Work Instruction List item press event.
         * The event is triggered when the user presses on work instruction item in a workinstruction list view.
         * If Overridden, this method must create and show the UI with capabilities to close it when the work instruction
         * is no longer needed.
         * @param { oEvent } SAPUI5 oEvent press object
         */
        onItemPressEvent: function ({ oEvent }) {
            const oWorkInstruction = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
            this.oDialog = new Dialog({
                title: `Work Instructions ${oWorkInstruction.workInstruction} (${oWorkInstruction.workInstructionElements.length})`,
                content: new sap.ui.layout.VerticalLayout({
                    content: new sap.m.ObjectHeader({
                        title: oWorkInstruction.description,
                        attributes: oWorkInstruction.workInstructionElements.map((oWiElement) => {
                            return new sap.m.ObjectAttribute({
                                title: "Description",
                                text: oWiElement.description
                            });
                        })
                    })
                }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Verify",
                    press: function () {
                        sap.m.MessageBox.information("Work instruction was recorded.");
                        this.oDialog.close();
                    }.bind(this)
                }),
                endButton: new Button({
                    text: "Discard",
                    press: function () {
                        sap.m.MessageBox.error("You must read and verify work instruction.");
                        this.oDialog.close();
                    }.bind(this)
                })
            });

            this.oDialog.open();
        }
    });
});
