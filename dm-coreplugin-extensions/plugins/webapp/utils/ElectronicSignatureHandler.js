sap.ui.define([
    "sap/ui/base/Object",
    "sap/dm/fnd/signature/lib/controller/SignatureDialogController",
    "sap/dm/fnd/signature/lib/service/SigningService",
    "sap/dm/dme/util/PlantSettings",
    "sap/dm/dme/podfoundation/util/PodUtility"
], function (BaseObject, SignatureDialogController,  SigningService, PlantSettings, PodUtility) {
    "use strict";
    return BaseObject.extend("sap.example.plugins.utils.ElectronicSignatureHandler", {
        constructor: function (oExtension) {
            this.oExtension = oExtension;
            this.oController = oExtension.getController();
        },

        openSignatureDialog: function (mDialogSettings) {
            if (!this._oSignatureController) {
                mDialogSettings.dialogController = this;
                this._oSignatureController = new SignatureDialogController(mDialogSettings);
            }
            this._oSignatureController.openSignatureDialog();
        },

        sign: function(oData){
            const sUrl = this.getSignRequestUrl();
            let aContexts = null;
            try {
                aContexts = this.getContexts();
            } catch (oError) {
                if (this.oExtension.onSigningError) {
                    this.oExtension.onSigningError(oError);
                } else {
                    this.oController.showErrorMessage(oError.message, true, true);
                }
                return false;
            }
            const oParameters = {
                plant: PlantSettings.getCurrentPlant(),
                signatory: oData.userId,
                password: oData.password,
                comment: oData.comment,
                reason: oData.reason,
                contexts: aContexts
            };
            return SigningService.sign(sUrl, oParameters)
            .then(function() {
                if (this.oExtension.onSigningSuccess) {
                    this.oExtension.onSigningSuccess();
                }
            }.bind(this))
            .catch(function (oError) {
                if (this.oExtension.onSigningError) {
                    this.oExtension.onSigningError(oError);
                } else {
                    this.oController.showErrorMessage(oError.message, true, true);
                }
            }.bind(this));
        },

        getSignRequestUrl: function () {
            const sUri = this.oController.getSignatureODataDataSourceUri();
            return `${sUri}electronicsignature/v1/signatures`;
        },

        getContexts: function () {

            let oPodSelectionModel = this.oController.getPodSelectionModel();

            let oSelectionsData = this.getSelectionsData(oPodSelectionModel);
            if (oSelectionsData.sfcs.length === 0) {
                let oError = {
                    message: "SFC is not selected."
                }
                throw oError;
            } else if (oSelectionsData.sfcs.length > 1) {
                let oError = {
                    message: "Please select only one SFC."
                }
                throw oError;
            }
            if (oSelectionsData.orders.length === 0) {
                let oError = {
                    message: "Order is required but not defined."
                }
                throw oError;
            }
            let aRoutingSteps = this.getRoutingSteps(oPodSelectionModel);
            if (aRoutingSteps.length === 0) {
                let oError = {
                    message: "Operation activity is required but not defined."
                }
                throw oError;
            } else if (aRoutingSteps.length > 1) {
                let oError = {
                    message: "Please select only one operation activity."
                }
                throw oError;
            }

            return this.loadContextsArray(oSelectionsData.sfcs[0], oSelectionsData.orders[0], aRoutingSteps[0]);
        },

        loadContextsArray: function (sSfc, sOrder, oRoutingStep) {
            let sRouting = oRoutingStep.routing;
            let sVersion = oRoutingStep.version;
            let sType = oRoutingStep.type;
            let sStepId = oRoutingStep.stepId;
            return [
                {
                   "type" : "sfc",
                   "values" : [
                       {
                           "name" : "sfc",
                           "value" : sSfc
                       }
                   ]
                },
                {
                    "type" : "order",
                    "values" : [
                       {
                           "name" : "order",
                           "value" : sOrder
                       }
                   ]
                },
                {
                   "type" : "routing",
                   "values" : [
                       {
                           "name" : "routing",
                           "value" : sRouting
                       },
                       {
                           "name" : "version",
                           "value" : sVersion
                       },
                       {
                           "name" : "type",
                           "value" : sType
                       }
                   ]
                },
                {
                   "type" : "routingStep",
                   "values" : [
                       {
                           "name" : "routingStep",
                           "value" : sStepId
                       }
                   ]
                }
            ];
        },

        getSelectionsData: function (oPodSelectionModel) {
            let oSelectionsData = {};
            let aInputs = [], aOrders = [];
            let aSelections = oPodSelectionModel.getSelections();
            if (aSelections && aSelections.length > 0) {
                let that = this;
                aSelections.forEach(function (oItem) {
                    that.addSelectionData(oItem, aInputs, aOrders);
                });
            }
            oSelectionsData.sfcs = aInputs;
            oSelectionsData.orders = aOrders;
            return oSelectionsData;
        },

        addSelectionData: function (oItem, aInputs, aOrders) {
            let oInput = oItem.getInput();
            if (PodUtility.isEmpty(oInput)) {
                if (oItem.getSfc()) {
                    oInput = oItem.getSfc().getSfc();
                }
            }
            if (PodUtility.isNotEmpty(oInput)) {
                aInputs.push(oInput);
                this.addShopOrder(oItem, aOrders);
            }
        },

        addShopOrder: function (oItem, aOrders) {
            let oShopOrder = oItem.getShopOrder();
            if (oShopOrder && oShopOrder.getShopOrder()) {
                aOrders.push(oShopOrder.getShopOrder());
            }
        },

        getRoutingSteps: function (oPodSelectionModel) {
            let aRoutingSteps = [];
            let aSelections = oPodSelectionModel.getSelectedRoutingSteps();
            if (aSelections && aSelections.length > 0) {
                aSelections.forEach(function (oRoutingStep) {
                    let oStep = {
                        routing: oRoutingStep.routing,
                        version: oRoutingStep.routingVersion,
                        type: oRoutingStep.routingType,
                        stepId: oRoutingStep.stepId
                    };
                    aRoutingSteps.push(oStep);
                });
            }
            return aRoutingSteps;
        }
    })
});
