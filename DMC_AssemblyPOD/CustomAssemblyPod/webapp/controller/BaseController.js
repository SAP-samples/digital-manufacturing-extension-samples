sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
    "sap/ui/core/TextDirection",
	"sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/custom/assemblypod/util/ApplicationUtil"
], function(Controller, UIComponent, TextDirection, MessageBox, MessageToast, ApplicationUtil) {
	"use strict";

	return Controller.extend("sap.custom.assemblypod.controller.BaseController", {
	    
        onInit: function() {
            this._oApplicationUtil = new ApplicationUtil(this.getOwnerComponent());
        },

        /**
         * Returns the ApplicationUtil instance for this controller
         * 
         * @param ApplicationUtil object
         */
        getApplicationUtil: function () {
            return this._oApplicationUtil;
        },

        /**
         * Returns the application Router
         * 
         * @param Router for navigation
         */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

        /**
         * Navigates to the input page
         * 
         * @param sPage Page to navigate to
         */
        navigateToPage: function(sPage) {
            if (typeof sPage !== "string") {
                return;
            }
            var oRouter = this.getRouter();
            if (oRouter && oRouter.navTo) {
                // this check added to fix QUnit tests
                oRouter.navTo(sPage, {}, false);
            }
        },

        /**
         * Displays message in MessageToast
         * 
         * @param oMessage Object of string, object or array type
         */
        showMessageToast: function (oMessage) {
            var sMessage = this.getMessage(oMessage);
            MessageToast.show(sMessage, { duration: 7000 });
        },

        /**
         * Displays message in Error MessageBox
         * 
         * @param oMessage Object of string, object or array type
         */
        showErrorMessage: function (oMessage) {
            var sMessage = this.getMessage(oMessage);
            MessageBox.error(sMessage, {
                title: this._oApplicationUtil.getI18nText("errorDialogTitle"),
                textDirection: TextDirection.Inherit
            });
        },

        /**
         * Displays message in Information MessageBox
         * 
         * @param oMessage Object of string, object or array type
         */
        showInformationMessage: function (oMessage) {
            var sMessage = this.getMessage(oMessage);
            MessageBox.information(sMessage, {
                title: this._oApplicationUtil.getI18nText("informationDialogTitle"),
                textDirection: TextDirection.Inherit
            });
        },

        /**
         * Returns a string message to display from the input object
         * @param oMessage Object of string, object or array type
         * @return string message to display Error object
         */
        getMessage: function (oMessage) {
            var sMessage = this._oApplicationUtil.getMessage(oMessage);
            if (!jQuery.trim(sMessage)) {
                sMessage = this._oApplicationUtil.getI18nText("message.unknownError");
            }
            return sMessage;
        }

	});

});