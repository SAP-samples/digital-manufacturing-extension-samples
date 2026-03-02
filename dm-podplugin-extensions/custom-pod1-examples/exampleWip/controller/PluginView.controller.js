sap.ui.define([
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/dm/dme/podfoundation/model/OperationKeyData",
    "sap/dm/dme/podfoundation/model/SfcKeyData",
    "sap/dm/dme/podfoundation/model/SfcData",
    "sap/dm/dme/podfoundation/model/Selection",
    "sap/dm/dme/message/ErrorHandler",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
    "sap/suite/ui/commons/networkgraph/layout/ForceBasedLayout",
    "sap/suite/ui/commons/networkgraph/ActionButton",
    "sap/suite/ui/commons/networkgraph/Node",
    "sap/ext/exampleplugins/exampleWip/util/NetworkGraphLoader"
], function (PluginViewController, OperationKeyData, SfcKeyData, SfcData, Selection,
             ErrorHandler, Fragment, JSONModel, LayeredLayout, ForceBasedLayout, ActionButton, Node,
             NetworkGraphLoader) {
    "use strict";

    PluginViewController.extend("sap.ext.exampleplugins.exampleWip.controller.PluginView", {
        onInit: function () {
            this._oNetworkGraphLoader = new NetworkGraphLoader(this);
        },

        onBeforeRenderingPlugin: function() {
            this.subscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);
        },

        onBeforeRendering: function () {
            // initialize model
            this._iCurrentPage = 1;

            // initialize view model
            var oView = this.getView();
            var oViewModel = new JSONModel();
            oViewModel.setProperty("/totalPages", 1);
            oViewModel.setProperty("/currentPage", this._iCurrentPage);
            oView.setModel(oViewModel);

            // initialize graph
            this._oNetworkGraphLoader.initialize();
        },

        onAfterRendering: function () {
            // initialize graph
            this._loadNetworkGraph();
        },

        onExit: function() {
            this.unsubscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);

            if (this._oQuickOrderView) {
                this._oQuickOrderView.destroy();
            }
            if (this._oQuickSfcView) {
                this._oQuickSfcView.destroy();
            }
        },

        _onPodSelectionChangeEvent: function (sChannelId, sEventId, oData) {
            // don't process if same object firing event
            if (this.isEventFiredByThisPlugin(oData)) {
                return;
            }

            if (oData && oData.clear === true) {
                this._clearModel();
                return;
            }
            this._iCurrentPage = 1;
            var oView = this.getView();
            var oModel = oView.getModel();
            oModel.setProperty("/currentPage", this._iCurrentPage);

            this._loadNetworkGraph();
        },

        onPageChange: function(oEvent) {
            var oPagingButton = this.getView().byId("pagingButton");
            if (!oPagingButton) {
                return;
            }
            this._iCurrentPage = oPagingButton.getPosition();

            this._loadNetworkGraph();
        },

        _loadNetworkGraph: function () {
            var sMessage;
            var oPodSelectionModel = this.getPodSelectionModel();
            this._sWorkCenter = oPodSelectionModel.getWorkCenter();
            if (!jQuery.trim(this._sWorkCenter)) {
                sMessage = this.getI18nText("missingWorkCenter");
                this.showErrorMessage(sMessage, false, true);
                return;
            }
            var iOffset = this._iCurrentPage - 1;
            if (this._iCurrentPage > 1) {
                iOffset = ((this._iCurrentPage * 20) - 20) + 1;
            }

            this._oNetworkGraphLoader.loadNetworkGraph(this._sWorkCenter, iOffset)
                .then(function () {

                }.bind(this))
                .catch(function (oError) {
                    var sError = ErrorHandler.getErrorMessage(oError);
                    if (!jQuery.trim(sError)) {
                        sError = this.getI18nText("errorRetrievingWorkCenterData",[this._sWorkCenter]);
                    }
                    this.showErrorMessage(sError, false, true);
                }.bind(this));
        },

        onSfcNodeSelection: function(oEvent) {

            var oNode = oEvent.getSource();
            var oData = this.getCustomDataValue(oNode, "data");
            var oSfc = oData.sfc;
            var oStepData = oData.step;

            var sPlant = this._oNetworkGraphLoader._getUserPlant();

            var oPodSelectionModel = this.getPodSelectionModel();

            oPodSelectionModel.clearSelections();
            oPodSelectionModel.clearOperations();

            var oSfcData = new SfcData();
            oSfcData.init({
                sfc: oSfc.sfc,
                quantity: oSfc.quantity,
                statusCode: oSfc.status.code,
                material: oSfc.material.material,
                materialAndVersion: oSfc.material.material + "/" + oSfc.material.version,
                materialDescription: oSfc.material.description
            });
            var oSfcKeyData = new SfcKeyData();
            oSfcKeyData.init({
                site: sPlant,
                sfc: oSfc.sfc,
            });

            var oSelection = new Selection();
            oSelection.setSfc(oSfcKeyData);
            oSelection.setSfcData(oSfcData);
            oPodSelectionModel.addSelection(oSelection);

            if (oStepData) {
                var oOperationData = {
                    site: sPlant,
                    operation: oStepData.operation.operation,
                    version: oStepData.operation.version
                };
                var oOperationKeyData = new OperationKeyData();
                oOperationKeyData.init(oOperationData);
                oPodSelectionModel.addOperation(oOperationKeyData);
            }
        },

        openDetail: function (oNode, oButton) {
            var sStatus = oNode.getStatus();
            if (sStatus === "OrderStatus") {
                this.openOrderDetail(oNode, oButton);

            } else if (sStatus === "SfcStatus") {
                this.openSfcDetail(oNode, oButton);
            }
        },

        openOrderDetail: function (oNode, oButton) {
            var oOrderData = this.getCustomDataValue(oNode, "data");
            var oModel = new JSONModel({
                icon: oNode.getIcon(),
                title: oNode.getKey(),
                description: oNode.getDescription(),
                orderType: oOrderData.orderType,
                orderStatus: oOrderData.orderStatus,
                priority: oOrderData.priority,
                buildQuantity: oOrderData.buildQuantity,
                releasedQuantity: oOrderData.releasedQuantity,
                orderedQuantity: oOrderData.orderedQuantity,
                scrappedQuantity: oOrderData.scrappedQuantity,
                doneQuantity: oOrderData.doneQuantity,
                quantityRejected: oOrderData.quantityRejected,
                quantityInQueue: oOrderData.quantityInQueue,
                quantityInWork: oOrderData.quantityInWork,
                orderPlannedStartDateTime: new Date(oOrderData.orderPlannedStartDateTime),
                orderPlannedCompleteDateTime: new Date(oOrderData.orderPlannedCompleteDateTime)
            });

            var that = this;
            if (!this._oQuickOrderView) {
                var sFragment = "sap.ext.exampleplugins.exampleWip.view.fragments.OrderFragment";
                this.createPopover("orderPopoverFragment", sFragment, function(oFragment) {
                    that._oQuickOrderView = oFragment;
                    that._oQuickOrderView.setModel(oModel);
                    that._oQuickOrderView.openBy(oButton);
                });
            } else {
                this._oQuickOrderView.setModel(oModel);
                setTimeout(function () {
                    that._oQuickOrderView.openBy(oButton);
                }, 0);
            }
        },

        openSfcDetail: function (oNode, oButton) {
            var oSfcData = this.getCustomDataValue(oNode, "data");
            var oModel = new JSONModel({
                icon: oNode.getIcon(),
                title: oNode.getKey(),
                description: oNode.getDescription(),
                sfc: oSfcData.sfc,
                quantity: oSfcData.quantity,
                scrappedQuantity: oSfcData.scrappedQuantity,
                doneQuantity: oSfcData.doneQuantity,
                quantityRejected: oSfcData.quantityRejected,
                quantityInQueue: oSfcData.quantityInQueue,
                quantityInWork: oSfcData.quantityInWork
            });

            var that = this;
            if (!this._oQuickSfcView) {
                var sFragment = "sap.ext.exampleplugins.exampleWip.view.fragments.SfcFragment";
                this.createPopover("sfcPopoverFragment", sFragment, function(oFragment) {
                    that._oQuickSfcView = oFragment;
                    that._oQuickSfcView.setModel(oModel);
                    that._oQuickSfcView.openBy(oButton);
                });
            } else {
                this._oQuickSfcView.setModel(oModel);
                setTimeout(function () {
                    that._oQuickSfcView.openBy(oButton);
                }, 0);
            }
        },

        createPopover: function (sId, sFragment, fnCallback) {
            return Fragment.load({
                id: sId,
                name: sFragment,
                controller: this
            }).then(function (oFragment) {
                this.getView().addDependent(oFragment);
                fnCallback.call(this, oFragment);
            }.bind(this));
        },

        getCustomDataValue: function (oNode, sName) {
            var aItems = oNode.getCustomData().filter(function (oData) {
                return oData.getKey() === sName;
            });

            return aItems.length > 0 && aItems[0].getValue();
        }
    });

});