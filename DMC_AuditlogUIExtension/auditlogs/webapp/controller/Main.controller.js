sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        var X_CSRF_TOKEN = "X-CSRF-Token";
        var PAGING = "paging";
        var APPLICATION_JSON = "application/json";

        return Controller.extend("sap.dm.dme.auditlogs.controller.Main", {
            mTokenDeferred: null,

            onInit: function () {
                var oModel = new JSONModel({
                    auditlogs: [],
                    masterlogs: [],
                    users: {},
                    auditcount: 0,
                    mdo: { "": { key: "" } },
                    fromDate: new Date(Date.now() - (1000 * 60 * 20)),
                    toDate: new Date(Date.now())
                });
                oModel.setSizeLimit(100000);
                this.getView().setModel(oModel, "oAuditModel");
            },

            handleButtonPress: function (oEvent) {

                var oFromDate = this.getView().getModel("oAuditModel").getProperty("/fromDate");
                var oToDate = this.getView().getModel("oAuditModel").getProperty("/toDate");

                var sFromDateString = new Date(oFromDate).toISOString().slice(0, 16);
                var sToDateString = new Date(oToDate).toISOString().slice(0, 16);

                var mParams = {
                    "time_from": sFromDateString,
                    "time_to": sToDateString
                };

                this.getAuditLog(mParams);
            },
            /**
             * Determines whether the current time range selection is valid for the request.
             */
            validateTimeSelection() {
                console.log("date validation");
                var cFrom = this.getView().byId('idFromDate');
                console.log("cFrom: " + cFrom.getValue());
                cFrom.setValueState(sap.ui.core.ValueState.None);
                var fromDate = cFrom.getValue();
                if (fromDate == null) {
                    cFrom.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                }
                var cTo = this.getView().byId('idToDate');
                cTo.setValueState(sap.ui.core.ValueState.None);
                var toDate = cTo.getValue();
                if (toDate == null) {
                    cTo.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                }
                var dateFromCheck = new Date(fromDate);
                var dateToCheck = new Date(toDate);
                if (dateToCheck.getTime() - dateFromCheck.getTime() <= 0) {
                    var oBundle = this.getView().getModel("i18n").getResourceBundle();
                    var sMsg = oBundle.getText("warningInvalidTimeRange");
                    // show message
                    MessageToast.show(sMsg);
                    cFrom.setValueState(sap.ui.core.ValueState.Error);
                    cTo.setValueState(sap.ui.core.ValueState.Error);
                    return false;
                }
                return true;
            },

            handleMDOChanged: function (oEvent) {
                var aAuditLogs = this.getView().getModel("oAuditModel").getData().masterlogs;
                var sSelectedKey = oEvent.getSource().getSelectedKey();
                var aFilteredLogs = [];

                if (sSelectedKey === "") {
                    this._setTableHeaderCount(aAuditLogs.length);
                    this.getView().getModel("oAuditModel").setProperty("/auditlogs", aAuditLogs);
                    return;
                }

                aAuditLogs.forEach(element => {
                    if (element.type === sSelectedKey) { aFilteredLogs.push(element); }
                });

                this._setTableHeaderCount(aFilteredLogs.length);
                this.getView().getModel("oAuditModel").setProperty("/auditlogs", aFilteredLogs);

            },
            handleUserChanged: function (oEvent) {
                var aAuditLogs = this.getView().getModel("oAuditModel").getData().masterlogs;
                var sSelectedKey = oEvent.getSource().getSelectedKey();
                var aFilteredLogs = [];

                if (sSelectedKey === "") {
                    this._setTableHeaderCount(aAuditLogs.length);
                    this.getView().getModel("oAuditModel").setProperty("/auditlogs", aAuditLogs);
                    return;
                }

                aAuditLogs.forEach(element => {
                    if (element.user === sSelectedKey) { aFilteredLogs.push(element); }
                });

                this._setTableHeaderCount(aFilteredLogs.length);
                this.getView().getModel("oAuditModel").setProperty("/auditlogs", aFilteredLogs);
            },

            getAuditLog: function (mParameters) {
                var sUrl = this.getOwnerComponent().getDataSourceUriByName("auditlog-RestSource");
                this.byId("auditLogTable").setBusy(true);
                this.ajaxGet(sUrl + "getaudits", mParameters, function (oResponseData, sStatus, oXhr) {
                    this.aFormattedLogs = this._formatResponseData(oResponseData);
                    this.updateAuditLogTable();
                    this.currentHandle = oXhr.getResponseHeader(PAGING) != "undefined" ? decodeURIComponent(oXhr.getResponseHeader(PAGING).substr(7)) : "";
                    this.byId("auditLogTable").setBusy(false);
                }.bind(this), function (oError) {
                    if (oError !== undefined) {
                        MessageBox.error(oError.message);
                    }
                    this.byId("auditLogTable").setBusy(false);
                });
            },

            loadMoreAuditLogs: function(oEvent){
                if(oEvent.getParameter("reason").toLowerCase() === "growing" && this.currentHandle &&  !this.byId("auditLogTable").getBusy()) {
                    var mParams = {
                        "handle": this.currentHandle
                    };
                    var sUrl = this.getOwnerComponent().getDataSourceUriByName("auditlog-RestSource");
                    this.fetchAuditLogsOnGrowing(sUrl, mParams);
                }
            },

            fetchAuditLogsOnGrowing : function(sUrl, mParams){
                this.byId("auditLogTable").setBusy(true);
                this.ajaxGet(sUrl + "getaudits", mParams, function (oResponseData, sStatus, oXhr) {
                    var latestFormattedLogs = this._formatResponseData(oResponseData);
                    this.aFormattedLogs = this.aFormattedLogs.concat(latestFormattedLogs);
                    this.updateAuditLogTable();
                    this.currentHandle = oXhr.getResponseHeader(PAGING) != "undefined" ? decodeURIComponent(oXhr.getResponseHeader(PAGING).substr(7)) : "";
                    this.byId("auditLogTable").setBusy(false);
                }.bind(this), function (oError) {
                    if (oError !== undefined) {
                        MessageBox.error(oError.message);
                    }
                    this.byId("auditLogTable").setBusy(false);
                });
            },

            updateAuditLogTable : function(){
                var oModel = this.getView().getModel("oAuditModel");
                oModel.refresh();
                oModel.setSizeLimit(this.aFormattedLogs.length);
                this._setTableHeaderCount(this.aFormattedLogs.length);
                oModel.setProperty("/auditlogs", this.aFormattedLogs);
                oModel.setProperty("/masterlogs", this.aFormattedLogs);
            },

            _setTableHeaderCount: function (iLength) {
                this.getView().getModel("oAuditModel").setProperty("/auditcount", iLength);
            },

            _formatResponseData: function (aAuditLogs) {
                var aObjectList = [];
                var oAuditMetadata = this.getView().getModel("oAuditModel").getData();
                for (var iAuditLogIndex = 0; iAuditLogIndex < aAuditLogs.length; iAuditLogIndex++) {

                    var oMessageObj = JSON.parse(aAuditLogs[iAuditLogIndex].message);
                    var iAttributeSize = oMessageObj.attributes.length;
                    for (var iAttributeIndex = 0; iAttributeIndex < iAttributeSize; iAttributeIndex++) {

                        //Prepare table rows
                        var jsonObj = {};
                        jsonObj.id = oMessageObj.object.id.entityId;
                        jsonObj.type = oMessageObj.object.type;
                        jsonObj.attribute = oMessageObj.attributes[iAttributeIndex].name;
                        jsonObj.new = oMessageObj.attributes[iAttributeIndex].new;
                        jsonObj.old = oMessageObj.attributes[iAttributeIndex].old;
                        jsonObj.time = new Date(oMessageObj.time);
                        jsonObj.user = oMessageObj.user;
                        aObjectList.push(jsonObj);

                        //Prepare filter bar objects
                        oAuditMetadata.mdo[oMessageObj.object.type.toString()] = { key: oMessageObj.object.type };
                        oAuditMetadata.users[oMessageObj.user.toString()] = { key: oMessageObj.user };
                    }
                }

                this.getView().getModel("oAuditModel").setProperty("/mdo", oAuditMetadata.mdo);
                this.getView().getModel("oAuditModel").setProperty("/users", oAuditMetadata.users);
                return aObjectList;
            },

            ajaxGet: function (sRequestContext, vParameters, fnSuccess, fnFailure) {
                var oSettings = {
                    method: "get",
                    url: sRequestContext,
                    contentType: APPLICATION_JSON,
                    data: vParameters,
                    headers: this.getHeaders(this.mTokenDeferred ? null : "Fetch")
                };

                var fnExtractTokenWrapper = function (oData, sStatus, oXhr) {
                    var sToken = oXhr.getResponseHeader(X_CSRF_TOKEN);
                    if (sToken) {
                        this.mTokenDeferred = jQuery.Deferred().resolve(sToken);
                    }
                    fnSuccess(oData, sStatus, oXhr);
                }.bind(this);
                var that = this;
                this.processRequest(jQuery.ajax(oSettings), that.mTokenDeferred ? fnSuccess : fnExtractTokenWrapper, fnFailure);
            },

            processRequest: function (oRequest, fnSuccess, fnFailure) {
                oRequest
                    .done(function (oData, sStatus, oXhr) {
                        fnSuccess(oData, sStatus, oXhr);
                    })
                    .fail(function (oXhr, sStatus, sErrorMessage) {
                        fnFailure(oXhr.responseJSON, sErrorMessage, oXhr.status);
                    });
            },

            fetchCsrfToken: function (sRequestUrl) {
                if (!this.mTokenDeferred) {
                    this.mTokenDeferred = jQuery.ajax({
                        url: this.getTokenUrlFromRequestUrl(sRequestUrl),
                        method: "head",
                        headers: { "X-CSRF-Token": "Fetch" }
                    }).then(function (oData, sStatus, oXhr) {
                        return oXhr.getResponseHeader(X_CSRF_TOKEN);
                    }, function (oXhr) {
                        return oXhr.getResponseHeader(X_CSRF_TOKEN);
                    });
                }
                return this.mTokenDeferred;
            },

            getTokenUrlFromRequestUrl: function (sUrl) {
                return sUrl.substring(0, sUrl.indexOf("/", sUrl.indexOf("/") + 1) + 1);
            },

            getHeaders: function (sToken) {
                var oHeaders = {
                    "Accept-Language": sap.ui.getCore().getConfiguration().getLanguageTag()
                };
                if (sToken) {
                    oHeaders[X_CSRF_TOKEN] = sToken;
                }
                return oHeaders;
            }
        });
    });