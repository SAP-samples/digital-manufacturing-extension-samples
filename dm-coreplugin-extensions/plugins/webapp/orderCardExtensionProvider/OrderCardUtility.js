sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/ui/layout/VerticalLayout"
], function (BaseObject, Button, Label, MessageToast, VerticalLayout) {
    "use strict";
    return BaseObject.extend("sap.example.plugins.orderCardExtensionProvider.OrderCardUtility", {
        constructor: function () {
        },

        setPluginEventExtension: function(oExtension){
            this.oPluginEventExtension = oExtension;
        },

        getPluginEventExtension: function(){
            return this.oPluginEventExtension;
        },

        getCoreExtension: function(){
            return this.oPluginEventExtension.getCoreExtension();
        },

        getController: function(){
            return this.getPluginEventExtension().getController();
        },

        getConfigurationValue: function(sProperty){
            let oController = this.getController();
            if (!oController) {
                return null;
            }
            return oController.getConfigurationValue(sProperty);
        },

        loadHeaderInformation: function(bShowHelp, bShowSupplier){
            
            let oInformationContainer = this.getCoreExtension().getPluginInformationContainer();
            let oToolbarContainer = this.getCoreExtension().getPluginToolbar();
            
            // keeps existing controlls so they are now re-created
            if (!this.oChildControls) {
                this.oChildControls = {};
            }
            if (bShowHelp) {
                let oActionButton = null;
                if (oToolbarContainer && this.oChildControls[oToolbarContainer.getId()]) {
                    oActionButton = this.oChildControls[oToolbarContainer.getId()];
                }
                if (oToolbarContainer && !oActionButton) {
	                // run in delay to give time for core buttons to render
                    setTimeout(function() {
                        this.addActionButton(oToolbarContainer);
                    }.bind(this), 500);
                }
            }
            if (bShowSupplier) {
                let oInformationControl = null;
                if (oInformationContainer && this.oChildControls[oInformationContainer.getId()]) {
                    oInformationControl = this.oChildControls[oInformationContainer.getId()];
                }
                if (oInformationContainer && !oInformationControl) {
                    this.addInformationControls(oInformationContainer);
                }
            }
        },

        addActionButton: function(oToolbar) {
            let that = this;
            let oActionButton = new Button({
                type: "Emphasized",
                text: "Help",
                press: [that.onHelpPress, that]
            });

            if (oToolbar.addAction) {
                oToolbar.addAction(oActionButton);
            } else if (oToolbar.addContent) {
                oToolbar.addContent(oActionButton);
            }
            this.oChildControls[oToolbar.getId()] = oActionButton;
        },

		onHelpPress: function (evt) {
			MessageToast.show("Custom Help button pressed");
		},

        addInformationControls: function(oInformationContainer) {
           let oInformationControl = new VerticalLayout();
           oInformationControl.addStyleClass("sapUiNoContentPadding");
           oInformationControl.addStyleClass("sapUiMediumMarginEnd");
           oInformationControl.addStyleClass("sapUiSmallMarginBottom");
           let oLabel = new Label({
                text: "Supplier",
                tooltip: "Selected Supplier"
           });
           let oLabelData = new Label({
                text: "{path: 'customData>/supplier'}",
                tooltip: "Selected Supplier"
           });
           oInformationControl.addContent(oLabel);
           oInformationControl.addContent(oLabelData);
           oInformationContainer.addItem(oInformationControl);
           this.oChildControls[oInformationContainer.getId()] = oInformationControl;
        }
    })
});
