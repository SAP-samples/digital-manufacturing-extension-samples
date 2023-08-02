sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/dm/dme/packingplugins/packingPlugin/controller/extensions/CreateExtensionConstants",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/model/json/JSONModel"
], function (PluginControllerExtension, CreateConstants, OverrideExecution, Dialog, Button, ButtonType, List, StandardListItem,
    JSONModel) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.packingplugins.packingPlugin.CreateExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === CreateConstants.CREATE_PACK_DIALOG) {
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
            return CreateConstants.EXTENSION_NAME;
        },

        createPackDialog: function (oPackController) {
            this.oDialog = new Dialog({
                title: "Available Carriers",
                content: new List({
                    items: {
                        path: "/carriers",
                        template: new StandardListItem({
                            title: "{carrier}",
                            counter: "{count}"
                        })
                    }
                }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Pack",
                    press: function () {
                        this.oDialog.close();
                    }.bind(this)
                }),
                endButton: new Button({
                    text: "Close",
                    press: function () {
                        this.oDialog.close();
                    }.bind(this)
                })
            });
            this.oDialog.setModel(new JSONModel({
                carriers: [
                    { carrier: "Carrier_1", count: 2 },
                    { carrier: "Carrier_2", count: 3 },
                    { carrier: "Carrier_3", count: 15 }
                ],
                unitId: 315
            }));
            oPackController.getView().addDependent(this.oDialog);
            return this.oDialog;
        }
    });
});
