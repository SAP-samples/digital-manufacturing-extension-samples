sap.ui.define([
	"sap/dm/dme/podfoundation/controller/PluginViewController",
	"sap/ui/model/json/JSONModel"
], function (PluginViewController, JSONModel) {
	"use strict";

	return PluginViewController.extend("dm.custom.ext.dynamic.urlintegration.controller.MainView", {
		onInit: function () {
			PluginViewController.prototype.onInit.apply(this, arguments);
			
			this.getView().setModel(new JSONModel(), "view");
			
			let sButtonLabel = this.getConfiguration().Text || 'Default';
			this.getView().getModel("view").setProperty("/actionButtonName", sButtonLabel);
			
			let sButtonLogoUrl = this.getConfiguration().LogoUrl || 'sap-icon://BusinessSuiteInAppSymbols/icon-source';
			this.getView().getModel("view").setProperty("/actionButtonLogoUrl", sButtonLogoUrl);
			
		},

		onBeforeRenderingPlugin: function () {
			
		},

		onActionButtonPress: function(oEvent){
			let sConfigUrl = this.getConfiguration().Url;
			let sPlant = this.getPodController().getUserPlant();
			let sOrder = this.getPodSelectionModel().getSelection().getShopOrder().shopOrder;
	
			let sParamVal = "";
			
			let param1_key = this.getConfiguration().Param1Key;
			let param2_key = this.getConfiguration().Param2Key;
			
			if(param1_key == 'order_custom_data'){
				sParamVal = this.getConfiguration().Param1Value;
				let sUrl = this.getPublicApiRestDataSourceUri() + 'order/v1/orders?plant=' + sPlant + '&order=' + sOrder;
				let that = this;

				this.ajaxGetRequest(sUrl, null,
					function (oResponseData) {
						console.log(oResponseData);
						let sDynamicUrl = sConfigUrl + '?customddata=' + oResponseData.customValues[0].value;
						sap.m.URLHelper.redirect(sDynamicUrl, true);
					},
					function (oError, sHttpErrorMessage) {
						let err = oError || sHttpErrorMessage;
						console.log(err);
					}
				);
			}
		},

		onExit: function () {
			PluginViewController.prototype.onExit.apply(this, arguments);
		}

	});
});