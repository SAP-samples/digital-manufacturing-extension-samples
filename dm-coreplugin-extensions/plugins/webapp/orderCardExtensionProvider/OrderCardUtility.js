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
            let oObjectPageLayout = this.getCoreExtension().getPluginContainer();
            let oHeaderTitle = oObjectPageLayout.getHeaderTitle();
            let oHeaderContent = oObjectPageLayout.getHeaderContent()[0];
            
            // keeps existing controlls so they are now re-created
            if (!this.oChildControls) {
                this.oChildControls = {};
            }
            if (bShowHelp) {
                let oActionButton = null;
                if (oHeaderTitle && this.oChildControls[oHeaderTitle.getId()]) {
                    oActionButton = this.oChildControls[oHeaderTitle.getId()];
                }
                if (oHeaderTitle && !oActionButton) {
                    this.addActionButton(oHeaderTitle);
                }
            }
            if (bShowSupplier) {
                let oInformationControl = null;
                if (oHeaderContent && this.oChildControls[oHeaderContent.getId()]) {
                    oInformationControl = this.oChildControls[oHeaderContent.getId()];
                }
                if (oHeaderContent && !oInformationControl) {
                    this.addInformationControls(oHeaderContent);
                }
            }
        },

        addActionButton: function(oHeaderTitle) {
            let that = this;
            let oActionButton = new Button({
                type: "Emphasized",
                text: "Help",
                press: [that.onHelpPress, that]
            });
            oHeaderTitle.addAction(oActionButton);
            this.oChildControls[oHeaderTitle.getId()] = oActionButton;
        },
		onHelpPress: function (evt) {
			MessageToast.show("Custom Help button pressed");
		},

        addInformationControls: function(oHeaderContent) {
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
           oHeaderContent.addItem(oInformationControl);
           this.oChildControls[oHeaderContent.getId()] = oInformationControl;
        }
    })
});
