sap.ui.define([
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (PluginViewController, JSONModel, MessageToast) {
    "use strict";

    return PluginViewController.extend("sap.ext.exampleplugins.customScrapConfirmation.controller.MainView", {
        onInit: function () {
            PluginViewController.prototype.onInit.apply(this, arguments);
            this.getView().setModel(new JSONModel(), "view");
            console.log('onInit in');
            this.updatePersonnelId(null);
            this.updateOrderInfo(null);
            console.log('onInit leave');
        },

        onBeforeRenderingPlugin: function () {
            console.log("onBeforeRenderingPlugin in");
            this.subscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
        },

        updateOrderInfo: function (oEvent) {
            if (this.getPodSelectionModel().getSelection() == null) {
                return;
            }
            var shopOrder = this.getPodSelectionModel().getSelection().getShopOrder();
            if (shopOrder != null) {
                this.getView().byId("SHOPORDER").setValue(shopOrder.shopOrder);

                var url = this.getPublicApiRestDataSourceUri() + 'order/v1/orders?order=' + shopOrder.shopOrder + '&plant=' + plant;
                var that = this;
                this.ajaxGetRequest(url, null,
                    function (oResponseData) {
                        if (oResponseData["customValues"] != null) {
                            var values = oResponseData["customValues"];
                            that.getView().byId("SALESORDER").setValue('');
                            for (var i = 0; i < values.length; i++) {
                                if (values[i]["attribute"] == that.getConfiguration().SalesOrderField) {
                                    that.getView().byId("SALESORDER").setValue(values[i]["value"]);
                                    break;
                                }
                            }
                        }

                    },
                    function (oError, sHttpErrorMessage) {
                        var err = oError || sHttpErrorMessage;
                    }
                );
            }
        },
        updatePersonnelId: function (oEvent) {
            var persUrl = this.getConfiguration().ApplicationUrl + "/"
                + this.getConfiguration().PeronnelInfoPath + "/"
                + this.getPodController().getUserId();
            var that = this;
            this.ajaxGetRequest(persUrl, null,
                function (oResponseData) {
                    if (oResponseData["personalId"] != null) {           //response data format:  { 'personnelId':'123', ... }
                        var value = oResponseData["personalId"];
                        if (value != null) {
                            that.getView().byId("PERSONNELNUM").setValue(value);
                            console.log("personnel number is: " + value)
                        }
                    }
                },
                function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    console.error("error is: " + err);
                }
            );
        },


        _onWorklistSelectEvent: function (oEvent) {
            console.log('_onWorklistSelectEvent in');
            this.updateOrderInfo(oEvent);
            console.log('_onWorklistSelectEvent leave');

        },
        onGetDetailsButtonPress: function (oEvent) {
            if (this.getPodSelectionModel().getSelection() == null) {
                return;
            }
            var shopOrder = this.getPodSelectionModel().getSelection().getShopOrder();
            if (shopOrder != null) {
                this.getView().byId("SHOPORDER").setValue(shopOrder.shopOrder);

                var url = 'https://{pod_plugin_host}/external/api' + '/sfc/v1/sfcdetail?plant=' + plant + '&sfc=' + this.getPodSelectionModel().getSelection().getSfc().sfc;
                var that = this;
                this.ajaxGetRequest(url, null,
                    function (oResponseData) {
                        console.log(oResponseData);

                    },
                    function (oError, sHttpErrorMessage) {
                        var err = oError || sHttpErrorMessage;
                    }
                );
            }
        },

        onActionButtonPress: function (oEvent) {

            var ppUrl = this.getConfiguration().ApplicationUrl + "/"
                + this.getConfiguration().ExecutionPath;

            this.ajaxPostRequest(ppUrl, {
                    "sfc": "SFC:" + this.getPodSelectionModel().getSelection().getSfc().sfc,
                    "personnelId": this.getView().byId("PERSONNELNUM").getValue(),
                    "varianceReasonCode": this.getView().byId("REASONCODE").getSelectedKey()

                },
                function (oResponseData) {
                    if (oResponseData["error"] != null) {
                        MessageToast.show("Failed on saving Personnel No. and Variance Reason code.");
                    } else {
                        MessageToast.show("Personnel number and Variance Reason Code confirmed.");
                    }
                }.bind(this),

                function (oError, sHttpErrorMessage) {
                    MessageToast.show(sHttpErrorMessage);
                }.bind(this)
            );
        },

        onExit: function () {
            PluginViewController.prototype.onExit.apply(this, arguments);
            this.unsubscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
        }

    });
});