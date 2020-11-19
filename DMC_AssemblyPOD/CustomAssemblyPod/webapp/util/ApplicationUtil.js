sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel",
    "sap/custom/assemblypod/util/RequestProcessor"
], function (BaseObject, ResourceModel, RequestProcessor) {
    "use strict";
    
    var JSON_CONTENT_TYPE = "application/json";

    var ApplicationUtil = BaseObject.extend("sap.custom.assemblypod.util.ApplicationUtil", {
        constructor: function (oOwnerComponent) {
            this._oOwnerComponent = oOwnerComponent;
            this._oRequestProcessor = new RequestProcessor(this);
        }
    });

    /**
     * Returns i18n text for the Application
     *
     * @return Owner component
     */
    ApplicationUtil.prototype.getOwnerComponent = function () {
        return this._oOwnerComponent;
    };

    /**
     * Returns i18n text for the Application
     *
     * @param sKey key of i18n text to get
     * @param aArgs optional array of paramters for text
     * @return String value
     */
    ApplicationUtil.prototype.getI18nText = function (sKey, aArgs) {
        return this.getI18nResourceBundle().getText(sKey, aArgs);
    };

    /**
     * Returns the Applications I18n resource bundle
     *
     * @return JSONModel
     */
    ApplicationUtil.prototype.getI18nResourceBundle = function () {
        if (!this._oI18nResourceBundle) {
            var oResourceModel = new ResourceModel({
                bundleName: "sap.custom.assemblypod.i18n.i18n"
            });
            this._oI18nResourceBundle = oResourceModel.getResourceBundle();
        }
        return this._oI18nResourceBundle;
    };

    /**
     * Returns the Applications model for storing context data
     *
     * @return JSONModel
     */
    ApplicationUtil.prototype.getGlobalModel = function () {
        return this._oOwnerComponent.getGlobalModel();
    };

    /**
     * Make a asynchronous call for the given URL and parameters
     *
     * @param {string} sMethod "POST" or "GET"
     * @param {string} sUrl The service url
     * @param {string|object|array} vParameters Query parameters
     * @param {string} sPlant Plant to set in request headers
     * @return {Promise}
     */
    ApplicationUtil.prototype.ajaxRequest = function (sMethod, sUrl, vParameters, sPlant) {
        
        var oPromise = new Promise(function (resolve, reject) {
            var oPayload = null;
            if (vParameters) {
                oPayload = JSON.stringify(vParameters);
            }
            if (sMethod.toLowerCase() === "get") {
                jQuery.ajax({
                    method: "get",
                    url: sUrl,
                    headers: {"x-dme-plant": sPlant},
                    contentType: JSON_CONTENT_TYPE,
                    data: vParameters,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        reject(xhr.responseJSON, errorMessage);
                    }
                });
            } else if (sMethod.toLowerCase() === "post") {
                jQuery.ajax({
                    method: "post",
                    url: sUrl,
                    headers: {"x-dme-plant": sPlant},
                    contentType: JSON_CONTENT_TYPE,
                    data: oPayload,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        reject(xhr.responseJSON, errorMessage);
                    }
                });
            } else if (sMethod.toLowerCase() === "delete") {
                jQuery.ajax({
                    method: "delete",
                    url: sUrl,
                    headers: {"x-dme-plant": sPlant},
                    contentType: JSON_CONTENT_TYPE,
                    data: oPayload,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        reject(xhr.responseJSON, errorMessage);
                    }
                });
            } else {
                reject("Invalid method type. Must be 'get', 'post' or 'delete'");
            }
        });

        return oPromise;
    };

    /**
     * Converts an object returned from a request and returns a string
     * @param oMessage object returned from a request
     * @return String message
     */
    ApplicationUtil.prototype.getMessage = function (oMessage) {
        if (!oMessage) {
            return null;
        }
        if (Array.isArray && Array.isArray(oMessage)) {
            return this.convertArrayToString(oMessage);
            
        } else if (typeof oMessage === "string") {
            return oMessage;

        } else if (oMessage.message) {
            if (Array.isArray && Array.isArray(oMessage.message)) { 
                return this.convertArrayToString(oMessage.message);
            }
            return "" + oMessage.message;
            
        } else if (oMessage.error && oMessage.error.message) {
            if (Array.isArray && Array.isArray(oMessage.error.message)) { 
                return this.convertArrayToString(oMessage.error.message);
            }
            return "" + oMessage.error.message;
        }
        return null;
    };

    /**
     * Converts array of strings to a single string
     * @param aStrings Array of strings
     * @return string for an array of strings
     */
    ApplicationUtil.prototype.convertArrayToString = function(aStrings) {
        if (aStrings && Array.isArray && Array.isArray(aStrings)) {
            var sMessage = "";
            if (aStrings.length > 0) {
                for (var i = 0; i < aStrings.length; i++) {
                    if (i > 0) {
                        sMessage = sMessage + "\n";
                    }
                    sMessage = sMessage + aStrings[i];
                }
            }
            return sMessage;
        }
        return aStrings;
    };

    /**
     * Returns a Promise to retrieve SFC Data for the input SFC name
     * @param sSfc <string> SFC
     * @resolve SfcStepDetails JSON object
     * @reject Error object
     */
    ApplicationUtil.prototype.getSfcData = function(sSfc) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.getSfcRequestData(sPlant, sSfc);
            
            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.sfcResponseMapper(oResults);
                var oError;
                if (!oResponse) {
                    oError = {
                        message: this.getI18nText("sfcNotFoundError", [ sSfc ])
                    };
                    reject(oError);
                    return;
                }
                if (oResponse.statusCode === "404") {
                    oError = {
                        message: this.getI18nText("sfcOnHoldError", [ sSfc ])
                    };
                    reject(oError);
                    return;
                }
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                if (err && jQuery.trim(err.status) && err.status === "NOT_FOUND") {
                    err.message = this.getI18nText("sfcNotFoundError", [ sSfc ]);
                }
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };
    
    /**
     * Returns a Promise to retrieve SFC Assembly Data for the input SFC name & Operation
     * @param sSfc <string> SFC
     * @param sOperation <string> Operation
     * @resolve sfcComponents JSON object
     * @reject Error object
     */
    ApplicationUtil.prototype.getSfcAssemblyData = function(sSfc, sOperation) {
    	var that = this;    	
        var oPromise = new Promise(function (resolve, reject) {
            
            // Reject if no SFC and no Operation
            var err;
            if (!sSfc || !sOperation) {
                err = {status: "", message: ""};
                err.status = "NOT_FOUND";
                err.message = that.getI18nText("keyDataMissing");
                reject(err);
                return;
            }
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.getComponentsRequestData(sPlant, sSfc, sOperation);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.componentsResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                err = oError || sHttpErrorMessage;
                if (err && jQuery.trim(err.status) && err.status === "NOT_FOUND") {
                    err.message = this.getI18nText("assemblyDataNotFoundError", [ sSfc ]);
                }
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };
    /**
     * Returns a Promise to retrieve Assembled Component Data
     * @param {string} sSfc <string> SFC
     * @param {string} sRoutingStep <string> Routing step id
     * @param {string} sOperation <string> Operation
     * @resolve List of assembled components data
     * @reject Error object
     */
    ApplicationUtil.prototype.getAssembledComponentsData = function(sSfc, sOperation) {
        var that = this;        
        var oPromise = new Promise(function (resolve, reject) {
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.getAssembledComponentsRequestData(sPlant, sSfc, sOperation);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.assembledComponentsResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                if (err && jQuery.trim(err.status) && err.status === "NOT_FOUND") {
                    err.message = this.getI18nText("assembledComponentsNotFoundError", [ sSfc ]);
                }
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    /**
     * Returns a Promise to add a component
     * @param oRequestData Request data:
     *  var oRequestData = {
     *      resource: "",
     *      sfc: "",
     *      operation: "",
     *      component: "",
     *      componentVersion: "",
     *      quantity: n,
     *      dataFields: [{fieldName: sFieldName, value: oValue}, {}, ..]
     *  }
     * @resolve add component response
     * @reject Error object
     */
    ApplicationUtil.prototype.addComponent = function(oRequestData) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.addComponentRequestData(sPlant, oRequestData);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.addComponentsResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    /**
     * Returns a Promise to remove a component
     * @param oRequestData Request data:
     *  var oRequest = {
     *      plant: "",
     *      resource: "",
     *      sfc: "",
     *      operation: "",
     *      component: "",
     *      componentVersion: "",
     *      quantity: n
     *  };
     * @resolve remove component response
     * @reject Error object
     */
    ApplicationUtil.prototype.removeComponent = function(oRequestData) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.removeComponentRequestData(sPlant, oRequestData);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.removeComponentResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    /**
     * Returns a Promise to start a sfc
     * @param sSfc SFC to Start
     * @param sOperation Operation to start at
     * @param sResource Resource
     * @param fQuantity Quantity
     * @resolve SFC Start response
     * @reject Error object
     */
    ApplicationUtil.prototype.startSfc = function(sSfc, sOperation, sResource, fQuantity) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.getStartSfcRequestData(sPlant, sSfc, sOperation, sResource, fQuantity);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.startSfcResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    /**
     * Returns a Promise to complete a sfc
     * @param sSfc SFC to complete
     * @param sOperation Operation to complete at
     * @param sResource Resource
     * @param fQuantity Quantity
     * @resolve SFC complete response
     * @reject Error object
     */
    ApplicationUtil.prototype.completeSfc = function(sSfc, sOperation, sResource, fQuantity) {
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var oData = that._oRequestProcessor.getCompleteSfcRequestData(sPlant, sSfc, sOperation, sResource, fQuantity);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var oResponse = this._oRequestProcessor.completeSfcResponseMapper(oResults);
                resolve(oResponse);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    /**
     * Returns a Promise to retrieve the default (thumbnail) material file id
     * @param oSfcData SFC Data
     * @resolve material file id
     * @reject Error object
     */
    ApplicationUtil.prototype.getMaterialFileId = function(oSfcData) {               
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");

            var oData = that._oRequestProcessor.getMaterialFileIdRequestData(sPlant, oSfcData.material, oSfcData.materialVersion);

            that.ajaxRequest(oData.type, oData.url, oData.parameters, sPlant)
            .then(function(oResults) {
                var sMaterialFileId = this._oRequestProcessor.materialFileIdResponseMapper(oResults);
                resolve(sMaterialFileId);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };
    
    /**
     * Returns a Promise to retrieve the material image file URI
     * @param sFileId file id to get information for
     * @resolve material file image URI or null if not defined
     * @reject Error object
     */
    ApplicationUtil.prototype.getMaterialFileImageUri = function(sFileId) {               
        var that = this;
        var oPromise = new Promise(function (resolve, reject) {
            
            var sPlant = that.getGlobalModel().getProperty("/plant");
            
            var sUrl = that._oRequestProcessor.getMaterialFileImageUrl(sFileId);

            that.ajaxRequest("GET", sUrl, null, sPlant)
            .then(function(oResults) {
                var sFileImageUri = this._oRequestProcessor.materialFileImageResponseMapper(sFileId, oResults);
                resolve(sFileImageUri);
            }.bind(that))
            .catch(function (oError, sHttpErrorMessage) {
                var err = oError || sHttpErrorMessage;
                reject(err);
            }.bind(that));
        });
        return oPromise;
    };

    return ApplicationUtil;
});
