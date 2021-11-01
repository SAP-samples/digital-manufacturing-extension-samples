sap.ui.define([
        "sap/ui/core/Fragment",
        "sap/ui/core/theming/Parameters",
        "sap/ui/model/json/JSONModel",
        "sap/m/Link",
        "sap/custom/assemblypod/controller/BaseController",
        "sap/custom/assemblypod/controller/Barcode.controller",
        "sap/custom/assemblypod/util/formatter"
	], function (Fragment, Parameters, JSONModel, Link, BaseController, Barcode, Formatter) {
		"use strict";

	    var MAIN_PAGE = "MainPage";
	    
		return BaseController.extend("sap.custom.assemblypod.controller.AssemblyView", { 

			formatter: Formatter,
			
            onBeforeRendering: function () {
                // handle subsequent loads of page ((after initial creation)
                this.getRouter().getRoute("AssemblyPage").attachPatternMatched(this.onAssemblyPageLoad, this);
            },
            
            onAfterRendering: function () {
                if (this._isPageRefresh()) {
                    // this may be due to user selecting F5 or Refresh in browser
                    // navigate back to main page.  This call here is invoked
                    // when running from Launch PAD on Cloud
                    this.navigateToPage(MAIN_PAGE);
                    return;
                }
                var oBreadCrumb = this.getView().byId("headerBreadcrumb");
                if (oBreadCrumb) {
                    oBreadCrumb.destroyLinks();
                    var sPageDescription = this._oApplicationUtil.getI18nText("assemblyPageDescription");
                    
                    var oLink = this._createBreadcrumbLink(MAIN_PAGE, this._oApplicationUtil.getI18nText("mainPageDescription"));
                    oBreadCrumb.addLink(oLink);
                    
                    oBreadCrumb.setCurrentLocationText(sPageDescription);
                    
                    oBreadCrumb.setVisible(true);
                }
                this.focusOnScanField();
            },
            
            onAssemblyPageLoad: function () {
                if (this._isPageRefresh()) {
                    // this may be due to user selecting F5 or Refresh in browser
                    // navigate back to main page.  This call here is invoked
                    // when running locally
                    this.navigateToPage(MAIN_PAGE);
                    return;
                }
                var oModel = this._oApplicationUtil.getGlobalModel();
                var oSfcData = oModel.getProperty("/sfcData");
                var aComponentData = oModel.getProperty("/sfcAssemblyData");

                // set up colors for SFC / Operation information areas
                var sStatusIcon = "sap-icon://border";
                var sColor = Parameters.get("sapUiWhite"); // white
                var sBackground = Parameters.get("sapUiPositive"); // green
                if (oSfcData.statusCode === "404") {
                    // SFC on Hold
                    sBackground = Parameters.get("sapUiNegative");
                    sStatusIcon = "sap-icon://status-negative";
                }
                var oHBox = this.getView().byId("sfcInfoHeader");
                if (oHBox) {
                    var oSelect = this._getJQuerySelectionById(oHBox.getId());
                    oSelect.css("background-color", sBackground);
                }

                // load global model with view data
                oModel.setProperty("/foregroundColor", sColor);
                oModel.setProperty("/backgroundColor", sBackground);
                oModel.setProperty("/sfc", oSfcData.sfc);
                oModel.setProperty("/statusIcon", sStatusIcon);
                oModel.setProperty("/materialDescription", oSfcData.materialDescription);
                oModel.setProperty("/shopOrder", oSfcData.shopOrder);
                oModel.setProperty("/material", oSfcData.material);
                oModel.setProperty("/startDatetime", oSfcData.startDatetime);
                oModel.setProperty("/endDatetime", oSfcData.endDatetime);
                oModel.setProperty("/sfcQuantity", oSfcData.sfcQuantity);
                oModel.setProperty("/operationStepId", oSfcData.operationStepId);
                oModel.setProperty("/operationDescription", oSfcData.operationDescription);
                oModel.setProperty("/allAssembled", this._isAllAssembled(aComponentData));
                
                // get the URI to the materials image thumbnail and set into model
                this._loadMaterialFileThumbnail(oSfcData, oModel)
                .then(function(sFileImageUri) {
                    // set image URI into model
                    if (jQuery.trim(sFileImageUri)) {
                        // image found, load model with URI and show container
                        oModel.setProperty("/materialfileThumbnail", this._getMaterialImageUri(sFileImageUri));
                        this._setMaterialImageContainerVisibility(true);
                    } else {
                        // no material image found, hide container holding image
                        this._setMaterialImageContainerVisibility(false);
                    }
                    // refresh view model and  place focus on component scan field
                    var oView = this.getView();
                    if (oView) {
                        oView.setModel(oModel);
                        oModel.refresh();
                    }
                    this.focusOnScanField();
                }.bind(this));
            },
            
            _isPageRefresh: function () {
                // checks if SFC Data is loaded.  If not it is most
                // likely a page refresh
                var oModel = this._oApplicationUtil.getGlobalModel();
                var oSfcData = oModel.getProperty("/sfcData");
                if (!oSfcData) {
                    return true;
                }
                return false;
            },
            
            _loadMaterialFileThumbnail: function (oSfcData, oModel) {
                // this will attempt to get the material image.
                // No errors are returned for this promise.  If 
                // image is not found, it will not be displayed
                var that = this;
                var oPromise = new Promise(function (resolve) {
                    var oUtil = that.getApplicationUtil();
    
                    // get Materials image thumb nail file id
                    oUtil.getMaterialFileId(oSfcData)
                    .then(function (sMaterialFileId) {
                        if (!jQuery.trim(sMaterialFileId)) {
                            // image file not defined for material
                            resolve(null);
                        }
                        // get the URI to the materials image thumbnail
                        oUtil.getMaterialFileImageUri(sMaterialFileId)
                        .then(function (sFileImageUri) {
                            resolve(sFileImageUri);
                        }.bind(this))
                        .catch(function (oError) {
                            resolve(null);
                        }.bind(this));
                        
                    }.bind(that))
                    .catch(function (oError) {
                        resolve(null);
                    }.bind(that));
                });
                return oPromise;
            },

            _setMaterialImageContainerVisibility: function (bShowContainer) {
                var oView = this.getView();
                if (!oView) {
                    // added to eliminate QUnit tests errors
                    return;
                }
                // will set material image containers visibility depending
                // on whether or not image is found
                var oMaterialContainer = oView.byId("materialImageContainer");
                var oMaterialImage = oView.byId("materialImageThumbnail");
                var oSfcInfoContainer = oView.byId("sfcOrderInfoContainer");

                if (bShowContainer) {
                    oMaterialContainer.setWidth("30%");
                    oMaterialContainer.addStyleClass("sapUiTinyMarginBegin");
                    oMaterialImage.setVisible(true);
                    oSfcInfoContainer.setWidth("70%");
                    oSfcInfoContainer.removeStyleClass("sapUiMediumMarginBegin");
                } else {
                    oMaterialContainer.setWidth("0px");
                    oMaterialContainer.removeStyleClass("sapUiTinyMarginBegin");
                    oMaterialImage.setVisible(false);
                    oSfcInfoContainer.setWidth("100%");
                    oSfcInfoContainer.addStyleClass("sapUiMediumMarginBegin");
                }
            },

            _getJQuerySelectionById: function (sId) {
                // needed by QUnit tests
                return jQuery("#" + sId);
            },
            
            onComponentChange: function (oEvent) {
                var oComponentField = this.getView().byId("scanComponent");
                var sValue = oComponentField.getValue();
                if (!jQuery.trim(sValue)) {
                    // nothing in scan field
                    return;
                }
                oComponentField.setValue("");
                
                // Parse the scanned barcode
                var oScanResult = Barcode.parseBarcode(sValue);

                var oUtil = this.getApplicationUtil();
                
                if (!oScanResult.isComponent) {
                    this.showMessageToast(oUtil.getI18nText("scannedInputNotComponent"));
                    this.focusOnScanField();
                    return;
                }
				
                var aComponentData = oUtil.getGlobalModel().getProperty("/sfcAssemblyData");
                var index = this._findComponentIndex(oScanResult.component, aComponentData);
                if (index < 0) {
                    this.showMessageToast(oUtil.getI18nText("componentNotAvailableToAssemble", [oScanResult.component]));
                    this.focusOnScanField();
                    return;
                }
                
                if (aComponentData[index].remainingQuantity === 0) {
                    this.showMessageToast(oUtil.getI18nText("componentIsAssembled", [oScanResult.component]));
                    this.focusOnScanField();
                    return;
                }

                // load information required to add the component
                var sResource = oUtil.getGlobalModel().getProperty("/resource");
                var oSfcData = oUtil.getGlobalModel().getProperty("/sfcData");
                var oRequestData = {
                    "operation": oSfcData.operation,
                    "resource": sResource,
                    "sfc": oSfcData.sfc,
                    "component": aComponentData[index].component,
                    "componentVersion": aComponentData[index].componentVersion,
                    "quantity": aComponentData[index].remainingQuantity,
                    "dataFields": oScanResult.dataFields
                };

                // add component
                var that = this;
                oUtil.addComponent(oRequestData)
                .then(function (oResults) {
                    // component added, update model data
                    aComponentData[index].assembledQuantity = aComponentData[index].requiredQuantity;
                    aComponentData[index].remainingQuantity = 0;
                    oUtil.getGlobalModel().setProperty("/sfcAssemblyData", aComponentData);
                    var bAllAssembled = this._isAllAssembled(aComponentData);
                    oUtil.getGlobalModel().setProperty("/allAssembled", bAllAssembled);
                    
                    var oView = this.getView();
                    if (oView) {
                        // needed to check for view since it can be null in QUnit tests
                        oView.getModel().refresh();
                    }
                    // place focus on scan field and if everything is assembled
                    // display prompt to user to complete
                    this.focusOnScanField();
                    if (bAllAssembled) {
                        setTimeout(function() {
                            that.openCompletePromptDialog();
                        }, 125);
                    }
                    
                }.bind(this))
                .catch(function (oError) {
                    setTimeout(function() {
                        that.showMessageToast(oError);
                        that._refreshComponentList();
                    }, 125);
                }.bind(this));
            },
            
            _findComponentIndex: function (sComponent, aComponentData) {
                var index = -1;
                if (aComponentData && aComponentData.length > 0) {
                    for (var i = 0; i < aComponentData.length; i++) {
                        if (sComponent === aComponentData[i].component) {
                            index = i;
                            break;
                        }
                    }
                }
                return index;
            },
            
            onRemoveComponent: function (oEvent) {
                var oButton = oEvent.getSource();
                var sComponent = oButton.data("component");
                if (!jQuery.trim(sComponent)) {
                    // component not assigned to 
                    return;
                }

                var oUtil = this.getApplicationUtil();
                var oGlobalModel = oUtil.getGlobalModel();

                var aComponentData = oGlobalModel.getProperty("/sfcAssemblyData");
                var index = this._findComponentIndex(sComponent, aComponentData);
                if (index < 0) {
                    // component not found
                    this.showMessageToast(oUtil.getI18nText("componentNotAvailableToRemove"));
                    this.focusOnScanField();
                    return;
                }

                var sResource = oGlobalModel.getProperty("/resource");
                var oSfcData = oGlobalModel.getProperty("/sfcData");
                
                // load information required to remove component
                var oRequestData = {
                    "operation": oSfcData.operation,
                    "resource": sResource,
                    "sfc": oSfcData.sfc,
                    "component": aComponentData[index].component,
                    "componentVersion": aComponentData[index].componentVersion,
                    "quantity": aComponentData[index].assembledQuantity
                };

                // remove component
                var that = this;
                oUtil.removeComponent(oRequestData)
                .then(function (oResults) {
                    // component removed, update model
                    aComponentData[index].remainingQuantity = aComponentData[index].assembledQuantity;
                    aComponentData[index].assembledQuantity = 0;
                    oUtil.getGlobalModel().setProperty("/sfcAssemblyData", aComponentData);
                    oUtil.getGlobalModel().setProperty("/allAssembled", this._isAllAssembled(aComponentData));
                    var oView = this.getView();
                    if (oView) {
                        // needed to check for view since it can be null in QUnit tests
                        oView.getModel().refresh();
                        oView.byId("completeButton").invalidate();
                    }
                    this.focusOnScanField();
                }.bind(this))
                .catch(function (oError) {
                    setTimeout(function() {
                        that.showMessageToast(oError);
                        that._refreshComponentList();
                    }, 125);
                }.bind(this));
            },
            
            /***
             * Handle sending the Complete once the Assembly has been performed
             */
            onComplete: function() {
                var oUtil = this.getApplicationUtil();
                var oGlobalModel = oUtil.getGlobalModel();
                var oSfcData = oGlobalModel.getProperty("/sfcData");
                var sResource = oGlobalModel.getProperty("/resource");

                oUtil.completeSfc(oSfcData.sfc, oSfcData.operation, sResource, null)
                .then(function (oResults) {
                    // Navigate to the Main page
                    this.navigateToPage(MAIN_PAGE);
                }.bind(this))
                .catch(function (oError) {
                    this._handleCompleteError(oError);
                }.bind(this));
            },
            
            _handleCompleteError: function(oError) {
                // added to support QUnit tests
                var that = this;
                setTimeout(function() {
                    that.showMessageToast(oError);
                    that._refreshComponentList();
                }, 125);
            },
            
            /***
             * Confirm Button pressed
             */
            openCompletePromptDialog: function (oEvent) {
                this._oConfirmDialog = sap.ui.xmlfragment("sap.custom.assemblypod.view.fragments.ConfirmDialog", this);
                this.getView().addDependent(this._oConfirmDialog);

                // Add handler to properly close the dialog upon the ESC character being pressed.
                var that = this;
                this._oConfirmDialog.setEscapeHandler(function (oPromise) {
                    that._handleConfirmDialogCancel();
                    oPromise.resolve();
                });

                this._oConfirmDialog.open();
            },
            
            /***
             * Confirm Dialog
             */
            _handleConfirmDialogOK: function () {             	
            	this.onComplete();
            	
                // Close the dialog
                this._handleConfirmDialogCancel();
            },
            
            /***
             * Confirm Dialog Cancel pressed
             */
            _handleConfirmDialogCancel: function () {
                this.getView().removeDependent(this._oConfirmDialog);
                this._oConfirmDialog.close();
                this._oConfirmDialog.destroy();
                this._oConfirmDialog = null;
                this.focusOnScanField();
            },
            
            _refreshComponentList: function () {
                var oUtil = this.getApplicationUtil();
                var oGlobalModel = oUtil.getGlobalModel();
                var oSfcData = oGlobalModel.getProperty("/sfcData");
                if (!oSfcData) {
                    // this only occurs during unit tests for add / remove
                    this.focusOnScanField();
                    return null;
                }
    
                // get updated SFC Assembly data and refresh page
                return this._oApplicationUtil.getSfcAssemblyData(oSfcData.sfc, oSfcData.operation)
                .then(function (oSfcAssyResults) {
                    oGlobalModel.setProperty("/sfcAssemblyData", oSfcAssyResults);
                    oGlobalModel.setProperty("/allAssembled", this._isAllAssembled(oSfcAssyResults));
                    var oView = this.getView();
                    if (oView) {
                        oView.setModel(oGlobalModel);
                        oView.getModel().refresh();
                    }
                    this.focusOnScanField(this._showCompletePromptOnRefresh, this);
                    
                }.bind(this))
                .catch(function (oError) {
                    this.showMessageToast(oError);
                    this.focusOnScanField();
                }.bind(this));
            },

            _showCompletePromptOnRefresh: function() {
                var oUtil = this.getApplicationUtil();
                var oGlobalModel = oUtil.getGlobalModel();
                var oSfcAssyResults = oGlobalModel.getProperty("/sfcAssemblyData");
                if (this._isAllAssembled(oSfcAssyResults)) {
                    this.openCompletePromptDialog();
                }
            },

            _createBreadcrumbLink: function(sPage, sDescription) {
                var that = this;
                return new Link("breadcrumb" + sPage + "Link", {
                    text: sDescription,
                    press: function () {
                        that.navigateToPage(sPage);
                    }
                });
            },

            _getMaterialImageUri: function(sFileImageUri) {
                var sImageUri = sFileImageUri;
                var sUrl = this._getUrl();
                if (sUrl.indexOf("/test/mock.html") > 0) {
                    // in case we are manually testing locally
                    sImageUri = "./integration/mock/mockData/ain/lightbulb.png";
                } else if (sUrl.indexOf("/test/integration") > 0) {
                    // in case we are manually testing locally
                    sImageUri = "./mock/mockData/ain/lightbulb.png";
                }
                return sImageUri;
            },

            _getUrl: function() {
                // added for QUnit tests
                return window.location.href;
            },

            _isAllAssembled: function(aComponents) {
                if (aComponents && aComponents.length > 0) {
                    for (var i = 0; i < aComponents.length; i++) {
                        if (aComponents[i].remainingQuantity > 0) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },
            
            focusOnScanField: function (fnCallback, fnContext) {
                var oView = this.getView();
                if (oView) {
                    // view not defined and cannot be stubbed in some QUnit tests
                    var oScanField = oView.byId("scanComponent");
                    if (oScanField) {
                        setTimeout(function() {
                            oScanField.focus();
                            if (fnCallback) {
                                fnCallback.call(fnContext);
                            }
                        }, 500);
                    }
                }
            },
            
            onComponentSelectionChange: function(oEvent) {
                var oTable = this.getView().byId("componentTable");
                var oSelectedItem = oTable.getSelectedItem();
                var oRowData = oSelectedItem.getBindingContext().getObject();
                var oUtil = this.getApplicationUtil();
                var oSfcData = oUtil.getGlobalModel().getProperty("/sfcData");
                
                this.showAssembledDataPopover(oSelectedItem, oSfcData.sfc, oSfcData.operation, oRowData.component);
            },
            
            showAssembledDataPopover: function(oSelectedItem, sSfc, sOperation, sComponent) {
                return this.getApplicationUtil().getAssembledComponentsData(sSfc, sOperation)
                .then(function (aResults) {
                    if (!aResults || aResults.length === 0 || aResults[0].dataFields.length === 0) {
                        this.focusOnScanField();
                        return;
                    }
                    var index = this._findComponentIndex(sComponent, aResults);
                    if (index < 0) {
                        this.focusOnScanField();
                        return;
                    }
                    var oDataModel = new JSONModel();
                    oDataModel.setData(aResults[index]);
                    this.getView().setModel(oDataModel, "AssembledData");
                    
                    this.openAssembledDataPopover(oSelectedItem);
                    
                }.bind(this))
                .catch(function (oError) {
                    var that = this;
                    setTimeout(function() {
                        that.showMessageToast(oError);
                        that.focusOnScanField();
                    }, 125);
                }.bind(this));
            },

            openAssembledDataPopover: function(oSelectedItem) {
                this._bAssembledDataPopoverOpening = true;
                if (this.oAssembledDataPopover) {
                    this.oAssembledDataPopover.openBy(oSelectedItem);
                } else {
                    this.createAndOpenAssembledDataPopover(oSelectedItem);
                }
            },

            createAndOpenAssembledDataPopover: function (oSelectedItem) {
                return Fragment.load({
                    id: "assembledDataPopover",
                    name: "sap.custom.assemblypod.view.fragments.AssembledDataPopover",
                    controller: this
                }).then(function (oFragment) {
                    this.getView().addDependent(oFragment);
                    this.oAssembledDataPopover = oFragment;
                    this.oAssembledDataPopover.openBy(oSelectedItem);
                }.bind(this));
            },
            
            onAssembledDataPopoverOpened: function(oEvent) {
                // this is to help return focus to scan field after popup close
                this._bAssembledDataPopoverOpening = false;
            },
            
            onAssembledDataPopoverClose: function(oEvent) {
                // this is to help return focus to scan field after popup close
                if (!this._bAssembledDataPopoverOpening) {
                    // if another popup is not opening, put focus back to scan field
                    this.focusOnScanField();
		        }
            }
		});
	});
