sap.ui.define([
    "sap/dm/dme/podfoundation/controller/PluginViewController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (PluginViewController, JSONModel, MessageToast) {
    "use strict";

    return PluginViewController.extend("sap.custom.plugins.integrationextension.controller.MainView", {
        onInit: function () {
            PluginViewController.prototype.onInit.apply(this, arguments);

            this.getView().setModel(new JSONModel(), "view");

        },

        onBeforeRenderingPlugin: function () {
            console.log("onBeforeRenderingPlugin in");
            this.subscribe("WorklistSelectEvent", this._onWorklistSelectEvent, this);
            //this.subscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);
            // this.subscribe("OperationListSelectEvent", this._onOperationListSelectEvent, this);
            //this.subscribe("OperationChangeEvent", this._onOperationChangeEvent, this);
            //this.subscribe("WorklistRefreshEvent", this._onWorklistRefreshEvent, this);
            
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
                bBackVisible = this._oConfiuration.async;
                bCloseVisible = this._oConfiuration.logLevel;
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
        updateOrderInfo: function(oEvent){
            if(this.getPodSelectionModel().getSelection() ==null){
                return;
            }
            var shopOrder = this.getPodSelectionModel().getSelection().getShopOrder();
            if (shopOrder != null){
                this.getView().byId("SHOPORDER").setValue(shopOrder.shopOrder);

                var url = this._oPodController.getPublicApiRestDataSourceUri()+'/order/v1/orders?order=' +shopOrder.shopOrder+ '&plant=' + plant;
                var that=this;
                this._oPodController.ajaxGetRequest(url, null,
                    function (oResponseData) {
                        if (oResponseData["customValues"] !=null){
                            var values = oResponseData["customValues"];
                            that.getView().byId("SALESORDER").setValue('');
                            for (var i =0 ; i <values.length; i++){
                                if(values[i]["attribute"]==that.getConfiguration().SalesOrderField){
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
        updatePersonnelId: function(oEvent){
            var persUrl = this.getConfiguration().ApplicationUrl+ "/"
             + this.getConfiguration().PeronnelInfoPath + "/"
             + sap.ushell.Container.getService("UserInfo").getUser().getEmail();
             var that =this;
             this.ajaxGetRequest(persUrl, null,
                    function (oResponseData) {
                        if (oResponseData["personalId"] !=null){           //response data format:  { 'personnelId':'123', ... }
                            var value = oResponseData["personalId"];
                            if(value != null){
                                that.getView().byId("PERSONNELNUM").setValue(value);
                                console.log("personnel number is: " + value)
                            }
                        }                   
                },
                function (oError, sHttpErrorMessage) {
                    var err = oError || sHttpErrorMessage;
                    console.error("error is: "+err);
                }
                );
            

        },

        onInit: function(){
            PluginViewController.prototype.onInit.apply(this, arguments);

            console.log('onInit in');
            this.updatePersonnelId(null);
            this.updateOrderInfo(null);            
            console.log('onInit leave');
        },

        _onWorklistSelectEvent: function(oEvent){
            console.log('_onWorklistSelectEvent in');
            this.updateOrderInfo(oEvent);
            console.log('_onWorklistSelectEvent leave');
           
        },
        onGetDetailsButtonPress: function(oEvent){
             if(this.getPodSelectionModel().getSelection() ==null){
                return;
            }
            var shopOrder = this.getPodSelectionModel().getSelection().getShopOrder();
            if (shopOrder != null){
                this.getView().byId("SHOPORDER").setValue(shopOrder.shopOrder);

                var url = 'https://{pod_plugin_host}/external/api' + '/sfc/v1/sfcdetail?plant=' + plant + '&sfc=' + this.getPodSelectionModel().getSelection().getSfc().sfc;
                var that=this;
                this._oPodController.ajaxGetRequest(url, null,
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
            
             var ppUrl = this.getConfiguration().ApplicationUrl+ "/"
             + this.getConfiguration().ExecutionPath;
                
            this.ajaxPostRequest(ppUrl, {
                    "sfc": "SFC:"+ this.getPodSelectionModel().getSelection().getSfc().sfc,
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
            //this.unsubscribe("PodSelectionChangeEvent", this._onPodSelectionChangeEvent, this);
        }

    });
});