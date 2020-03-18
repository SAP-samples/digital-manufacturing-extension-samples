sap.ui.define([
	"sap/dm/dme/podfoundation/controller/PluginViewController",
	"sap/ui/model/json/JSONModel"
], function (PluginViewController, JSONModel) {
	"use strict";

	return PluginViewController.extend("sap.custom.plugins.urlintegration.controller.MainView", {
		onInit: function () {
			PluginViewController.prototype.onInit.apply(this, arguments);
			
			this.getView().setModel(new JSONModel(), "view");
			
			var sButtonLabel = this.getConfiguration().Text || 'Default';
			this.getView().getModel("view").setProperty("/actionButtonName", sButtonLabel);
			
			var sButtonLogoUrl = this.getConfiguration().LogoUrl || 'sap-icon://BusinessSuiteInAppSymbols/icon-source';
			this.getView().getModel("view").setProperty("/actionButtonLogoUrl", sButtonLogoUrl);
			
		},

		onBeforeRenderingPlugin: function () {
			this.subscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
			this.subscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);
			this.subscribe("OperationListSelectEvent", this._onOperationListSelectEvent, this);
			this.subscribe("OperationChangeEvent", this._onOperationChangeEvent, this);

			this.subscribe("WorklistRefreshEvent", this._onWorklistRefreshEvent, this);

			var oView = this.getView();

			if (!oView) {
				return;
			}

			//Get Configuration Data
			this._oConfiuration = this.getConfiguration();

			var bBackVisible = true;
			var bCloseVisible = true;

			if (this.isPopup() || this.isDefaultPlugin()) {
				bBackVisible = false;
				bCloseVisible = false;
			} else if (this._oConfiuration) {
				bBackVisible = this._oConfiuration.backButtonVisible;
				bCloseVisible = this._oConfiuration.closeButtonVisible;
			}
			
			var oBackButton = oView.byId("backButton");
			var oCloseButton = oView.byId("closeButton");

			if (oBackButton) {
				oBackButton.setVisible(bBackVisible);
			}

			if (oCloseButton) {
				oCloseButton.setVisible(bCloseVisible);
			}
			
		},

		
		onActionButtonPress: function(oEvent){
			var sUrl = this.getConfiguration().Url;
			
			var sParameterStr = "?";
			var sParamVal = "";
			
			var param1_key = this.getConfiguration().Param1Key;
			var param2_key = this.getConfiguration().Param2Key;
			var param3_key = this.getConfiguration().Param3Key;
			
			if(param1_key){
				sParamVal = this.getConfiguration().Param1Value;
				sParameterStr = sParameterStr + param1_key + "=" + sParamVal;
			}
			
			if(param2_key){
				sParameterStr = sParameterStr + "&";
				
				
				sParamVal = this.getConfiguration().Param2Value;
				
				if(this.getPodSelectionModel().getSelection() && param2_key == 'input_orderid' && sParamVal == '<>'){
					sParamVal = this.getPodSelectionModel().getSelection().getShopOrder().shopOrder;
				}
				else if(this.getPodSelectionModel().getSelection() && param2_key == 'input_sfc' && sParamVal == '<>'){
					sParamVal = this.getPodSelectionModel().getSelection().getSfc().sfc;
				}
				else if(!this.getPodSelectionModel().getSelection() && sParamVal == '<>'){
					sap.m.MessageToast.show("Select at least one SFC");
					return;
				}
				
				
				sParameterStr = sParameterStr + param2_key + "=" + sParamVal;
			}
			
			if(param3_key){
				sParameterStr = sParameterStr + "&";
				sParamVal = this.getConfiguration().Param3Value;
				sParameterStr = sParameterStr + param3_key + "=" + sParamVal;
			}
			
			if(sParameterStr.length > 1){
				var sUrlWithParams = sUrl + sParameterStr;
				sap.m.URLHelper.redirect(sUrlWithParams, true);
			}
			else{
				sap.m.URLHelper.redirect(sUrl, true);
			}
		},

		onExit: function () {
			PluginViewController.prototype.onExit.apply(this, arguments);
			this.unsubscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
			this.unsubscribe("WorklistRefreshedEvent", this._onWorklistRefreshedEvent, this);
			this.unsubscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);
		}

	});
});