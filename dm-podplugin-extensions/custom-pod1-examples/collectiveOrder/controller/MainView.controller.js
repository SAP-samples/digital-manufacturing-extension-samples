sap.ui.define([
	"sap/dm/dme/podfoundation/controller/PluginViewController",
	"sap/ui/model/json/JSONModel"
], function (PluginViewController, JSONModel) {

	return PluginViewController.extend("sap.ext.exampleplugins.collectiveOrder.controller.MainView", {
		onInit: function () {
			PluginViewController.prototype.onInit.apply(this, arguments);
			oModel = new JSONModel();
			this.getView().setModel(oModel);
			this.oModelSettings = new JSONModel({
				maxIterations: 200,
				maxTime: 500,
				initialTemperature: 200,
				coolDownStep: 1
			});
			this.getView().setModel(this.oModelSettings, "settings");
		},

		onBeforeRenderingPlugin: function () {

			let sPlant = this.getPodController().getUserPlant();
			let sUrl = this.getPublicApiRestDataSourceUri() + 'order/v1/orders/list?plant=' + sPlant + "&size=200";
			let i, nodeValues = [], lineValues = [];
			let that = this;

			this.ajaxGetRequest(sUrl, null,
				function (oResponseData) {
					console.log(oResponseData);
					for (i = 0; i < oResponseData.content.length; i++) {
						let orderWithLeadingOrderAsFinished1 = oResponseData.content[i].customValues.filter(function (v) {
							return (v.attribute == "LEADING_ORDER" && v.value == "FINISHED1")
						});
						if (orderWithLeadingOrderAsFinished1.length) {
							let sParentOrder = oResponseData.content[i].customValues.filter(function(v){return v.attribute == "PARENT_ORDER"})[0].value;
							let nodeObj = {
								"key": i,
								"title": oResponseData.content[i].order,
								"attributes": [
									{
										"label": that.getI18nText("buildQuantity"),
										"value": oResponseData.content[i].buildQuantity
									},
									{
										"label": that.getI18nText("parentOrder"),
										"value": sParentOrder
									}
								]
							}

							// Color for the Nodes
							if (sParentOrder == "ROOT") {
								nodeObj.status = "Success";
								nodeObj.icon = "sap-icon://copy";
							} else {
								nodeObj.status = "Information";
								nodeObj.icon = "sap-icon://accelerated";
							}
							nodeValues.push(nodeObj);
						}
					}
					for (i = 0; i < nodeValues.length; i++) {
						if (nodeValues[i].attributes[1].value != "ROOT") {
							let parentKey = nodeValues.filter(function (e) {
								return e.title == nodeValues[i].attributes[1].value
							})[0].key;

							let lineObj = {
								"from": parentKey,
								"to": nodeValues[i].key
							}
							lineValues.push(lineObj);
						}
					}
					that.getView().getModel().setData({
						"nodes": nodeValues,
						"lines": lineValues
					});
				},
				function (oError, sHttpErrorMessage) {
					let err = oError || sHttpErrorMessage;
					console.log(err);
				}
			);
		},

		refreshWorklist: function (oEvent) {
			let selectedOrder = oEvent.getSource().getTitle();
			this.publish("WorklistRefreshEvent", {
				"source": this,
				"order": selectedOrder,
				"forceSelection": true,
				"sendToAllPages": true
			});

			this.showMessage("Worklist Refresh event triggered for Order "+ selectedOrder, true);
		},


		onLayoutChanged: function (oEvent) {
			var oGraph = this.byId("graph");
			if (oEvent.getParameter("selectedItem").getKey() == "20") {
				oGraph.setLayoutAlgorithm(new sap.suite.ui.commons.networkgraph.layout.NoopLayout());
			} else if (oEvent.getParameter("selectedItem").getKey() == "40") {
				oGraph.setLayoutAlgorithm(new sap.suite.ui.commons.networkgraph.layout.LayeredLayout());
			}
		},


		onExit: function () {
			PluginViewController.prototype.onExit.apply(this, arguments);
		}
	});
});