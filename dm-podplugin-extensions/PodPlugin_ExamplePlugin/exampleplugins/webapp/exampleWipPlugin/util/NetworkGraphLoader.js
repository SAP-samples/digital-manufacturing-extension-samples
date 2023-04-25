sap.ui.define([
    "sap/ui/base/Object",
    "sap/dm/dme/logging/Logging",
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
    "sap/suite/ui/commons/networkgraph/layout/ForceBasedLayout",
    "sap/suite/ui/commons/networkgraph/ActionButton",
    "sap/suite/ui/commons/networkgraph/Node"
], function (BaseObject, Logging, JSONModel, LayeredLayout, ForceBasedLayout, ActionButton, Node) {
        "use strict";

    var oLogger = Logging.getLogger("sap.ext.exampleplugins.exampleWipPlugin.util.NetworkGraphLoader");

    var NetworkGraphLoader = BaseObject.extend("sap.ext.exampleplugins.exampleWipPlugin.util.NetworkGraphLoader", {
        constructor: function (oController) {
            this._oPluginController = oController;
            oLogger.debug("NetworkGraphLoader created...");
        }
    });

    /**
     * initializes the graph
     */
    NetworkGraphLoader.prototype.initialize = function () {
        var oView = this._oPluginController.getView();
        this._oGraph = oView.byId("graph");
        var oGraphData = {
            nodes: [],
            lines: []
        };
        var oGraphModel = new JSONModel();
        oGraphModel.setData(oGraphData);
        this._oGraph.setModel(oGraphModel);
        this._oGraph.attachAfterLayouting(this._onBeforeLayouting, this);
    };

    /**
     * Promise responsible for retrieving the order data for the input work center, material and page offset
     *
     * @param {string} sWorkCenter Work center to get orders for
     * @param {int} iPageOffset Page offset to get orders for (20 orders per page)
     * @resolve returns the order data
     * @reject returns fatal error message
     */
    NetworkGraphLoader.prototype.loadNetworkGraph = function (sWorkCenter, iPageOffset) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            var sUrl = that._oPluginController.getPublicApiRestDataSourceUri() + "/sfc/v1/worklist/orders?plant=" + that._getUserPlant();
            sUrl = sUrl + "&workCenter=" + sWorkCenter;
            sUrl = sUrl + "&allSfcSteps=true&page.size=20&page.offset=" + iPageOffset;
            that._oPluginController.ajaxGetRequest(sUrl, null,
                function (oResponseData) {
                    that._renderNetworkGraph(sWorkCenter, oResponseData);
                    resolve();
                },
                function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    reject(err);
                }
            );

        });
        return oPromise;
    };

    NetworkGraphLoader.prototype._renderNetworkGraph = function (sWorkCenter, oOrderData) {

        this._sTopParent = sWorkCenter;
        this._mExplored = [this._sTopParent];

        var oGraphData = this._createNetworkGraphData(sWorkCenter, oOrderData);
        var iLength = oGraphData.nodes.length + 100;

        var oView = this._oPluginController.getView();
        var oModel = oView.getModel();
        oModel.setProperty("/totalPages", oGraphData.totalPages);

        this._oGraph = oView.byId("graph");
        if (this._oGraph.getNodes() > 0) {
            this._oGraph.destroyAllElements();
        }
        var oGraphModel = this._oGraph.getModel();
        oGraphModel.setSizeLimit(iLength);

        oGraphModel.setProperty("/nodes", oGraphData.nodes);
        oGraphModel.setProperty("/lines", oGraphData.lines);
        oGraphModel.refresh();

        this._setFilter();

    };

    NetworkGraphLoader.prototype._createNetworkGraphData = function (sWorkCenter, aOrderData) {

        this._aNetworkGraphNodes = [];
        this._aNetworkGraphLines = [];

        // add nodes starting with work center
        this._addWorkCenterNode(sWorkCenter, aOrderData);

        var iTotalPages = 1;
        if (this._aNetworkGraphNodes.length > 20) {
            iTotalPages = Math.ceil(this._aNetworkGraphNodes.length / 20);
        }

        // create model for network graph
        var oNetworkGraphData = {
            nodes: this._aNetworkGraphNodes,
            lines: this._aNetworkGraphLines,
            totalPages: iTotalPages
        };
        return oNetworkGraphData;
    };

    NetworkGraphLoader.prototype._addWorkCenterNode = function(sWorkCenter, aOrderData) {
        var oWorkCenterNode = {
            "id": sWorkCenter,
            "title": this._oPluginController.getI18nText("WorkCenterNode.title"),
            "description": sWorkCenter,
            "src": "sap-icon://machine",
            "status": "WorkCenterStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": "",
            "childCount": aOrderData.length,
            "data": sWorkCenter
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oWorkCenterNode;

        // add order nodes
        for (var i = 0; i < aOrderData.length; i++) {
            this._addOrderNode(aOrderData[i], sWorkCenter);
        }
    };

    NetworkGraphLoader.prototype._addOrderNode = function(oOrder, sParent) {
        var sId = sParent + "_" + oOrder.order;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("OrderNode.title"),
            "description": oOrder.order,
            "src": "sap-icon://BusinessSuiteInAppSymbols/icon-production",
            "status": "OrderStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": oOrder.orderSfcs.length,
            "data": oOrder
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };

        // add SFC nodes
        if (oOrder.orderSfcs.length > 0) {
            for (var j = 0; j < oOrder.orderSfcs.length; j++) {
                this._addSfcNode(oOrder.orderSfcs[j], sId);
            }
        }
    };

    NetworkGraphLoader.prototype._addSfcNode = function(oSfc, sParent) {

        // find current step
        var oStepData = this._findCurrentStepData(oSfc);
        var oStep = null;
        if (oStepData) {
            oStep = oStepData.step;
        }

        // create node
        var sId = sParent + "_" + oSfc.sfc;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("SfcNode.title"),
            "description": oSfc.sfc,
            "src": "sap-icon://BusinessSuiteInAppSymbols/icon-products",
            "status": "SfcStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": 0,
            "data": {sfc: oSfc, step: oStep}
        };

        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };

        var count = 0;
        if (oStep) {
            this._addOperationNode(oStep, sId);
            count++;
        }
        if (oSfc.material) {
            this._addMaterialNode(oSfc.material, sId);
            count++;
        }
        if (oSfc.bom) {
            this._addBomNode(oSfc.bom, sId);
            count++;
        }
        if (oSfc.routing) {
            this._addRoutingNode(oSfc.routing, sId);
            count++;
        }
        oNode.childCount = count;
    };

    NetworkGraphLoader.prototype._findCurrentStepData = function(oResponseData) {
        var sStatusCode = oResponseData.status.code;
        for (var i = 0; i < oResponseData.steps.length; i++) {
            if ((sStatusCode === "401" || sStatusCode === "402") &&
                oResponseData.steps[i].quantityInQueue > 0) {
                // NEW or In-Queue and still shows quantity in-queue
                return {step: oResponseData.steps[i], status: "IN_QUEUE"};

            } else if (sStatusCode === "403" &&
                oResponseData.steps[i].quantityInWork > 0) {
                // In-Work and still has Quanitity in work
                return {step: oResponseData.steps[i], status: "IN_WORK"};
            }
        }
        return null;
    };

    NetworkGraphLoader.prototype._addMaterialNode = function(oMaterial, sParent) {
        var sId = sParent + "_" + oMaterial.material;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("MaterialNode.title"),
            "description": oMaterial.description,
            "src": "sap-icon://BusinessSuiteInAppSymbols/icon-material",
            "status": "MaterialStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": 0,
            "data": oMaterial
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };
    };

    NetworkGraphLoader.prototype._addBomNode = function(oBom, sParent) {
        var sId = sParent + "_" + oBom.bom;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("BillOfMaterialNode.title"),
            "description": oBom.bom,
            "src": "sap-icon://SAP-icons-TNT/bill-of-material",
            "status": "BomStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": 0,
            "data": oBom
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };
    };

    NetworkGraphLoader.prototype._addRoutingNode = function(oRouting, sParent) {
        var sId = sParent + "_" + oRouting.routing;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("RoutingNode.title"),
            "description": oRouting.routing,
            "src": "sap-icon://BusinessSuiteInAppSymbols/icon-split-segmentation",
            "status": "RoutingStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": 0,
            "data": oRouting
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };
    };

    NetworkGraphLoader.prototype._addOperationNode = function(oStep, sParent) {
        var oOperation = oStep.operation;
        var sId = sParent + "_" + oOperation.operation;
        var oNode = {
            "id": sId,
            "title": this._oPluginController.getI18nText("OperationNode.title"),
            "description": oOperation.description,
            "src": "sap-icon://SAP-icons-TNT/operations",
            "status": "OperationStatus",
            "attributes": [
                {
                    "label": "",
                    "value": ""
                }
            ],
            "parent": sParent,
            "childCount": 0,
            "data": oOperation
        };
        this._aNetworkGraphNodes[this._aNetworkGraphNodes.length] = oNode;
        this._aNetworkGraphLines[this._aNetworkGraphLines.length] = {
            "from": sParent,
            "to": sId
        };
    };

    NetworkGraphLoader.prototype.search = function (oEvent) {
        var sKey = oEvent.getParameter("key");

        if (sKey) {
            this._mExplored = [sKey];
            this._sTopSupervisor = sKey;
            this._oGraph.destroyAllElements();
            this._setFilter();

            oEvent.bPreventDefault = true;
        }
    };

    NetworkGraphLoader.prototype.suggest = function (oEvent) {
        var aSuggestionItems = [],
            aItems = this._oGraph.getModel().getData().nodes,
            aFilteredItems = [],
            sTerm = oEvent.getParameter("term");

        sTerm = sTerm ? sTerm : "";

        aFilteredItems = aItems.filter(function (oItem) {
            var sTitle = oItem.title ? oItem.title : "";
            return sTitle.toLowerCase().indexOf(sTerm.toLowerCase()) !== -1;
        });

        aFilteredItems.sort(function (oItem1, oItem2) {
            var sTitle = oItem1.title ? oItem1.title : "";
            return sTitle.localeCompare(oItem2.title);
        }).forEach(function (oItem) {
            aSuggestionItems.push(new sap.m.SuggestionItem({
                key: oItem.id,
                text: oItem.title
            }));
        });

        this._oGraph.setSearchSuggestionItems(aSuggestionItems);
        oEvent.bPreventDefault = true;
    };

    NetworkGraphLoader.prototype._setFilter = function () {
        var aNodesCond = [],
            aLinesCond = [];
        var fnAddBossCondition = function (sBoss) {
            aNodesCond.push(new sap.ui.model.Filter({
                path: 'id',
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sBoss
            }));

            aNodesCond.push(new sap.ui.model.Filter({
                path: "parent",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sBoss
            }));
        };

        var fnAddLineCondition = function (sLine) {
            aLinesCond.push(new sap.ui.model.Filter({
                path: "from",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sLine
            }));
        };

        this._mExplored.forEach(function (oItem) {
            fnAddBossCondition(oItem);
            fnAddLineCondition(oItem);
        });

        this._oGraph.getBinding("nodes").filter(new sap.ui.model.Filter({
            filters: aNodesCond,
            and: false
        }));

        this._oGraph.getBinding("lines").filter(new sap.ui.model.Filter({
            filters: aLinesCond,
            and: false
        }));
    };

    NetworkGraphLoader.prototype._handleCollapseExpand = function (oEvent) {
        var oNode = oEvent.getSource();
        var bCollapsed = oNode.getCollapsed();
        var index = this._findNodeIndex(oNode);
        this._oGraph.deselect();
        if (!bCollapsed) {
            if (index >= 0) {
                this._mExplored.splice(index, 1);
                this._collapseChildren(oNode);
            }
        } else {
            this._mExplored.push(oNode.getKey());
        }
        oNode.setCollapsed(!bCollapsed);
        this._oGraph.destroyAllElements();
        this._setFilter();

        var that = this;
        setTimeout(function() {
            that._focusOnSelection(oNode.getKey());
        }, 125);
    };

    NetworkGraphLoader.prototype._focusOnSelection = function (sKey) {
        var oNode = this._oGraph.getNodeByKey(sKey);
        if (!oNode) {
            return;
        }
        var bCollapsed = oNode.getCollapsed();
        if (bCollapsed) {
            oNode.focus();
        } else {
            var aChildren = oNode.getChildNodes();
            if (!aChildren || aChildren.length === 0) {
                oNode.focus();
                return;
            }
            aChildren[aChildren.length-1].focus();
        }
    };

    NetworkGraphLoader.prototype._findNodeIndex = function (oNode) {
        var index = -1;
        for (var i = 0; i < this._mExplored.length; i++) {
            if (this._mExplored[i] === oNode.getKey()) {
                index = i;
                break;
            }
        }
        return index;
    };

    NetworkGraphLoader.prototype._collapseChildren = function (oNode) {
        var aChildren = oNode.getChildNodes();
        if (!aChildren || aChildren.length == 0) {
            return;
        }
        for (var i = 0; i < aChildren.length; i++) {
            aChildren[i].setCollapsed(true);
            var index = this._findNodeIndex(aChildren[i]);
            if (index >= 0) {
                this._mExplored.splice(index, 1);
            }
        }
    };

    NetworkGraphLoader.prototype._loadMore = function (oNode, sName) {
        var oEvent = {
            getSource: function() {
                return oNode;
            }
        };
        this._handleCollapseExpand(oEvent);
    };

    NetworkGraphLoader.prototype._onBeforeLayouting = function (oEvent) {
        // nodes are not rendered yet (bOutput === false) so their invalidation triggers parent (graph) invalidation
        // which results in multiple unnecessary loading
        this._oGraph.preventInvalidation(true);

        var aNodes = this._oGraph.getNodes();
        aNodes.forEach(function (oNode) {
            var oExpandButton, oDetailButton, oUpOneLevelButton,
                iChildCount = this._oPluginController.getCustomDataValue(oNode, "childCount"),
                sNodeStatus = oNode.getStatus(),
                sParent;

            oNode.removeAllActionButtons();

            if (!iChildCount || iChildCount === "0") {
                // nodes without childCount - hide expand buttons
                oNode.setShowExpandButton(false);
                oNode.setCollapsed(false);
            } else {

                if (this._mExplored.indexOf(oNode.getKey()) === -1) {
                    // nodes with childCount > 0 but not yet expanded
                    // we create example expand button with dynamic loading
                    oNode.setShowExpandButton(false);
                    oNode.setCollapsed(true);

                    oExpandButton = new ActionButton({
                        title: "Expand",
                        icon: "sap-icon://sys-add",
                        press: function () {
                            this._loadMore(oNode, oNode.getKey());
                        }.bind(this)
                    });
                    oNode.addActionButton(oExpandButton);

                } else {
                    oNode.setCollapsed(false);

                    // manager with already loaded data - default expand button
                    oNode.setShowExpandButton(true);
                    oNode.attachCollapseExpand(this._handleCollapseExpand, this);
                }
            }

            // add detail link -> example popover
            if (sNodeStatus === "OrderStatus" ||
                sNodeStatus === "SfcStatus") {
                oDetailButton = new ActionButton({
                    title: "Detail",
                    icon: "sap-icon://hint",
                    press: function (oButtonEvent) {
                        this._oPluginController.openDetail(oNode, oButtonEvent.getParameter("buttonElement"));
                    }.bind(this)
                });
                oNode.addActionButton(oDetailButton);

                if (sNodeStatus === "SfcStatus") {
                    var oSfc = this._oPluginController.getCustomDataValue(oNode, "data");
                    oNode.attachPress(oSfc, this._onSfcNodeSelection, this);
                }
            }

            // if current user is root we can add 'up one level'
            if (oNode.getKey() === this._sTopParent) {
                sParent = this._oPluginController.getCustomDataValue(oNode, "parent");
                if (sParent) {
                    oUpOneLevelButton = new ActionButton({
                        title: "Up one level",
                        icon: "sap-icon://arrow-top",
                        press: function () {
                            var aParents = oNode.getCustomData().filter(function (oData) {
                                return oData.getKey() === "parent";
                            });
                            var sNextParent = aParents.length > 0 && aParents[0].getValue();
                            this._loadMore(sNextParent);
                            this._sTopParent = sNextParent;
                        }.bind(this)
                    });
                    oNode.addActionButton(oUpOneLevelButton);
                }
            }
        }, this);

        if (typeof this._bInitialized === "undefined") {
            this._bInitialized = true;
        }

        this._oGraph.preventInvalidation(false);
    };

    NetworkGraphLoader.prototype._onSfcNodeSelection = function(oEvent) {
        this._oPluginController.onSfcNodeSelection(oEvent);
    };

    NetworkGraphLoader.prototype._getUserPlant = function () {
        var oPodController = this._oPluginController.getPodController();
        if (oPodController && oPodController.getUserPlant) {
            this._sPlant = oPodController.getUserPlant();
        }
        return this._sPlant;
    };

    return NetworkGraphLoader;
});