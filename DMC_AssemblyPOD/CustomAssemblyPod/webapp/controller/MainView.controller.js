sap.ui.define([
    "sap/base/util/UriParameters",
    "sap/custom/assemblypod/controller/BaseController"
], function (UriParameters, BaseController) {
	"use strict";

	return BaseController.extend("sap.custom.assemblypod.controller.MainView", { 
	    
        onBeforeRendering: function () {
            
            // extract key data from URL parameters
            var sWorkCenter = this._getUrlParameter("WORK_CENTER");
            var sResource = this._getUrlParameter("RESOURCE");
            var sPlant = this._getUrlParameter("PLANT");
            
            //sPlant = "SAP";

            // update global model with initial information
            var oModel = this._oApplicationUtil.getGlobalModel();
            oModel.setProperty("/workCenter", sWorkCenter);
            oModel.setProperty("/resource", sResource);
            oModel.setProperty("/plant", sPlant);
            oModel.setProperty("/customerLogo", this._getCustomerLogo());
            oModel.setProperty("/currentDate", new Date());
            this.getView().setModel(oModel);
            
            // set to refocus to scan field on return to page from assembly page
            this.getRouter().getRoute("MainPage").attachPatternMatched(this.focusOnScanField, this);
        },
        
        onAfterRendering: function () {
            // page rendered, place focus on scan field
            this.focusOnScanField();

            // make header date visible on main page
            var oTextField = this.getView().byId("headerPageDescription");
            if (oTextField) {
                oTextField.setVisible(true);
            }
        },
        
        focusOnScanField: function () {
            // will place focus back on SFC Field after small delay
            var oView = this.getView();
            if (oView) {
                // view not defined and cannot be stubbed in some QUnit tests
                var oScanField = oView.byId("scanField");
                if (oScanField) {
                    setTimeout(function() {
                        oScanField.focus();
                    }, 500);
                }
            }
        },

        onSfcChange: function (oEvent) {
            // SFC Scan Field has changed
            var oSfcField = oEvent.getSource();
            var sSfc = oSfcField.getValue().toUpperCase();
            if (!jQuery.trim(sSfc)) {
                // Nothing to do when SFC field is blank (or cleared)
                return null;
            }
            
            // update model with SFC value
            this.getView().getModel().setProperty("/sfc", sSfc);
            
            // need to reset now to allow next SFC to be scanned
            oSfcField.setValue("");

            // load SFC and Operation data.  Only navigate to
            // assembly page if success getting data.  
            return this._loadSfcData(sSfc)
            .then(function () {
                
                // get sfc (with operation) and resource to start
                var oUtil = this.getApplicationUtil();
                var oSfcData = oUtil.getGlobalModel().getProperty("/sfcData");
                var sResource = oUtil.getGlobalModel().getProperty("/resource");
                
                // start sfc (if required) and then get Assembly data
                this._startSfc(sSfc, oSfcData, sResource)
                .then(function () {

                    // get SFC Assembly data and if successful navigate to Assembly page
                    oUtil.getSfcAssemblyData(sSfc, oSfcData.operation)
                    .then(function (oSfcAssyResults) {
                        // component list retrieved, navigate to the Assembly page
                        oUtil.getGlobalModel().setProperty("/sfcAssemblyData", oSfcAssyResults);
                        this.navigateToPage("AssemblyPage");
                    }.bind(this))
                    .catch(function (oError) {
                        this.showMessageToast(oError);
                        this.focusOnScanField();
                    }.bind(this));
                    
                }.bind(this))
                .catch(function (oError) {
                    this.showMessageToast(oError);
                    this.focusOnScanField();
                }.bind(this));
                
            }.bind(this))
            .catch(function (oError) {
                this.showMessageToast(oError);
                this.focusOnScanField();
            }.bind(this));
        },
        
        _loadSfcData: function (sSfc, sWorkCenter) {
            var that = this;
            var oPromise = new Promise(function (resolve, reject) {
                var oUtil = that.getApplicationUtil();

                // get SFC data (with current operation information).
                oUtil.getSfcData(sSfc, sWorkCenter)
                .then(function (oSfcResults) {
                    // load global model
                    oUtil.getGlobalModel().setProperty("/sfcData", oSfcResults);
                    resolve();
                }.bind(that))
                .catch(function (oError) {
                    reject(oError);
                }.bind(that));
            });
            return oPromise;
        },
        
        _startSfc: function (sSfc, oSfcData, sResource) {
            var that = this;
            var oPromise = new Promise(function (resolve, reject) {
                if (oSfcData.stepStatus === "IN_WORK") {
                    // already started
                    resolve();
                    return;
                }

                // start SFC
                var oUtil = that.getApplicationUtil();
                oUtil.startSfc(sSfc, oSfcData.operation, sResource, null)
                .then(function (oResults) {
                    // SFC started, update models with status
                    oSfcData.stepStatus = "IN_WORK";
                    oSfcData.statusDescription = "ACTIVE";
                    oUtil.getGlobalModel().setProperty("/sfcData", oSfcData);
                    resolve();
                }.bind(that))
                .catch(function (oError) {
                    reject(oError);
                }.bind(that));
            });
            return oPromise;
        },
        
        _loadSfcAssemblyData: function (sSfc, sOperation) {
            var that = this;
            var oPromise = new Promise(function (resolve, reject) {
                // get SFC Assembly data.
                var oUtil = that.getApplicationUtil();
                oUtil.getSfcAssemblyData(sSfc, sOperation)
                .then(function (oSfcAssyResults) {
                    // load global model
                    oUtil.getGlobalModel().setProperty("/sfcAssemblyData", oSfcAssyResults);  
                    resolve();
                }.bind(that))
                .catch(function (oError) {
                    reject(oError);
                }.bind(that));
            });      
                            
            return oPromise;
        },

        _getCustomerLogo: function() {
            var sCustomerLogo = "./images/customer.png";
            var sUrl = this._getUrl();
            if (sUrl.indexOf("/test/mock.html") > 0) {
                // in case we are manually testing locally
                sCustomerLogo = "../images/customer.png";
            } else if (sUrl.indexOf("/test/integration") > 0) {
                // in case we are manually testing locally
                sCustomerLogo = "../../images/customer.png";
            }
            return sCustomerLogo;
        },
        
        _getUrlParameter: function(sParameter) {
            return this._getUrlParameters().get(sParameter);
        },

        _getUrlParameters: function() {
            if (!this._oUriParameters) {
                this._oUriParameters = new UriParameters(this._getUrl());
            }
            return this._oUriParameters;
        },

        _getUrl: function() {
            // added for QUnit tests
            return window.location.href;
        }
	});
});
