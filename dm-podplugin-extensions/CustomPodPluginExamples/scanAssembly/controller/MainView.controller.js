sap.ui.define([
	'jquery.sap.global',
	"sap/dm/dme/podfoundation/controller/PluginViewController",
	"sap/m/MessageToast",
], function (jQuery, PluginViewController, MessageToast) {
	"use strict";
	var sfcDetail, bomDetails;
	var podModelData = "";

	return PluginViewController.extend("sap.ext.exampleplugins.scanAssembly.controller.MainView", {
		onInit: function () {
			PluginViewController.prototype.onInit.apply(this, arguments);
			this.preloadData();
		},

		onBeforeRenderingPlugin: function () {
			this.subscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
			var oView = this.getView();
			if (!oView) {
				return;
			}
		},

		_onWorklistSelectEvent: function (oEvent) {
			if (this.getPodSelectionModel().getSelection() != undefined) {
				if (podModelData != "" && podModelData.sfc == this.getPodSelectionModel().getSelection().input &&
					sfcDetail != undefined) {
					if (sfcDetail.responseJSON.sfc != this.getPodSelectionModel().getSelection().input) {
						this.preloadData();
					}
				} else {
					this.preloadData();
				}
			}
		},

		preloadData: function () {
			if (this.getPodSelectionModel().getSelection() != undefined) {
				podModelData = this.getPodModelData();
				sfcDetail = this.getSFCDetails(podModelData);
				let bom = sfcDetail.responseJSON.bom.bom;
				let version = sfcDetail.responseJSON.bom.version;
				let bomType = sfcDetail.responseJSON.bom.type;
				var bomPayload = {
					"plant": podModelData.plant,
					"bom": bom,
					"version": version,
					"bomType": bomType
				};
				bomDetails = this.getBOMDetails(bomPayload);
			}
		},

		getPodModelData: function () {
			let inputNumber = this.getView().byId("inputFieldText").getValue();
			let selectedSFC = "";
			let selectedOrder = "";
			let resource = "";
			let operation = "";
			let WC = "";
			if (this.getPodSelectionModel().getSelection() != undefined) {
				selectedSFC = (this.getPodSelectionModel().getSelection().input != undefined) ? this.getPodSelectionModel().getSelection().input : "";
				selectedOrder = (this.getPodSelectionModel().getSelection().shopOrder != undefined) ? this.getPodSelectionModel().getSelection().shopOrder.shopOrder : null;
			}

			if (this.getPodSelectionModel().resource != undefined)
				resource = this.getPodSelectionModel().resource.resource;

			let podType = this.getPodSelectionModel().podType;

			if (podType == "WORK_CENTER")
				WC = this.getPodSelectionModel().workCenter;
			else
				if (podType == "OPERATION")
					operation = this.getPodSelectionModel().operations[0].operation;

			let plant = this.getUserPlant();
			var payload = {
				'plant': plant,
				'scanInput': inputNumber,
				'order': selectedOrder,
				'workCenter': WC,
				'resource': resource,
				'operation': operation,
				'podType': podType,
				'sfc': selectedSFC
			};
			return payload;
		},

		onScanSubmit: function () {
			var payload = {
				'plant': podModelData.plant,
				'scanInput': this.getView().byId("inputFieldText").getValue(),
				'order': podModelData.order,
				'workCenter': podModelData.workCenter,
				'resource': podModelData.resource,
				'operation': podModelData.operation,
				'podType': podModelData.podType,
				'sfc': podModelData.sfc
			};

			this.getView().byId("inputFieldText").setValue("");

			var responseScanType = this.getScanInputType(payload);
			if (responseScanType.type == "M") {
				var scanType = "COMPONENT";
				this.assembleMaterial(payload, responseScanType.bomComponent, scanType);
			} else {
				let message = payload.scanInput + this.getI18nText("validationComponentScanComponentInvalidMsg") + bomDetails.responseJSON[0].bom;
				MessageToast.show(message);
				this.doPostProcessingActivity(payload.scanInput, "NA", "ERROR", message);
			}
		},

		getScanInputType: function (payload) {
			var responseJSONObject = { "type": "" };
			var componentList = bomDetails.responseJSON[0].components;
			var filteredBomComponent = componentList.filter(function (value, index, arr) {
				return value.material.material == payload.scanInput && value.assemblyOperationActivity.operationActivity == payload.operation;
			});

			if (filteredBomComponent.length > 0) {
				if (filteredBomComponent[0].material.material == payload.scanInput) {
					responseJSONObject.type = "M";
					responseJSONObject.bomComponent = filteredBomComponent[0];
					responseJSONObject.bomDataType = "MAT_SCAN";
				} else {
					responseJSONObject.type = "NA";
				}
			} else {
				responseJSONObject.type = "NA";
			}
			return responseJSONObject;
		},

		assembleMaterial: function (payload, bomComponent, scanType) {
			var assemblyRequestJSON = {
				"plant": payload.plant,
				"operationActivity": bomComponent.assemblyOperationActivity.operationActivity,
				"sfc": payload.sfc,
				"component": bomComponent.material.material,
				"componentVersion": bomComponent.material.version,
				"quantity": "1", //bomComponent.quantity
				"resource": payload.resource,
				"sequence": bomComponent.sequence,
				"dataFields": []
			};

			var url = this.getPublicApiRestDataSourceUri() +
				"assembly/v1/assembledComponents?async=false";
			var that = this;
			this.ajaxPostRequest(url, assemblyRequestJSON,
				function (oResponseData) {
					console.log(oResponseData);
					that.setBusy(false);
					var message = scanType + " " + that.getI18nText("assembleComponentSuccessMsg");
					MessageToast.show(message);
					that.doPostProcessingActivity(payload.scanInput, scanType, "SUCCESS", message);
					that.publishComponentListRefresh();
				},
				function (oError, sHttpErrorMessage) {
					var err = oError || sHttpErrorMessage;
					console.log(err);
					var message = that.getI18nText("assembleComponentErrorMsg") + " " + scanType + " " + err.errorMessageKey;
					MessageToast.show(message);
					that.doPostProcessingActivity(payload.scanInput, scanType, "ERROR", message);
				}
			);
		},

		doPostProcessingActivity: function (scanInput, scanType, status, message) {
			var type = "Neutral";
			if (status == "SUCCESS") {
				type = "Success";
			} else if (status == "ERROR") {
				type = "Negative";
			}

			var scanObject = {
				scanInput: scanInput,
				scanType: scanType,
				status: status,
				message: message,
				type: type,
				top: "TOP"
			};
			this.publishAssemblyStatus(scanObject);
		},

		publishComponentListRefresh: function () {
			this.publish("ComponentListRefreshEvent", {});
		},

		publishAssemblyStatus: function (scanObject) {
			this.publish("UpdateAssemblyStatusEvent", scanObject);
		},

		getSFCDetails: function (payload) {
			let sfcDetail = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: this.getPublicApiRestDataSourceUri() + "/sfc/v1/sfcdetail?plant=" + payload.plant + "&sfc=" + payload.sfc,
				async: false
			});
			return sfcDetail;
		},

		getBOMDetails: function (bomPayload) {
			var bomType = bomPayload.bomType;
			if (bomPayload.bomType == "USERBOM") {
				bomType = "MASTER"
			} else if (bomPayload.bomType == "SHOPORDERBOM") {
				bomType = "SHOP_ORDER"
			}

			let bomDetails = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: this.getPublicApiRestDataSourceUri() + "/bom/v1/boms?plant=" + bomPayload.plant + "&bom=" + bomPayload.bom + "&type=" + bomType,
				async: false
			});
			return bomDetails;
		},

		onExit: function () {
			this.unsubscribe("WorklistSelectEvent", {}, this);
			PluginViewController.prototype.onExit.apply(this, arguments);
		},
	});
});