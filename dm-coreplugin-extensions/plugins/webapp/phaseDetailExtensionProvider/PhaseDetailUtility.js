sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/m/OverflowToolbar",
    "sap/m/Text",
    "sap/m/ToolbarSpacer"
], function (BaseObject, Button, Label, MessageToast, OverflowToolbar, Text, ToolbarSpacer) {
    "use strict";
    return BaseObject.extend("sap.example.plugins.phaseDetailExtensionProvider.PhaseDetailUtility", {
        constructor: function () {
        },

        setPluginEventExtension: function(oExtension){
            this.oPluginEventExtension = oExtension
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

        byId: function(sId){
            return this.getController().getView().byId(sId);
        },

        createId: function(sId){
            return this.getController().getView().createId(sId);
        },

        loadHeaderInformation: function(){
            let oPanel = this.getCoreExtension().getPluginContainer();
            let oHeaderToolbar = oPanel.getHeaderToolbar();
            if (oHeaderToolbar) {
                // already created
                return;
            }
            oHeaderToolbar = new OverflowToolbar();
            oPanel.setHeaderToolbar(oHeaderToolbar);
            oHeaderToolbar.addContent(new ToolbarSpacer());
            this.addActionButton(oHeaderToolbar);
        },

        addActionButton: function(oHeaderToolbar) {
            let oControl = this.byId("helpButton");
            if (oControl) {
                // already defined
                return;
            }
            let that = this;
            let oActionButton = new Button("helpButton", {
                type: "Emphasized",
                text: "Help",
                press: [that.onHelpPress, that]
            });
            oHeaderToolbar.addContent(oActionButton);
        },
		onHelpPress: function (evt) {
			MessageToast.show("Custom Help button pressed");
		},

        loadFormControls: function() {
            // keeps existing controlls so they are not re-created
            if (!this.oChildControls) {
                this.oChildControls = {};
            }
            let oForm = this.getCoreExtension().getPhaseDetailsSimpleForm();
            let aContent = oForm.getContent();
            let sLabelId = this.createId("inspectionRequiredLabel");
            let sValueId = this.createId("inspectionRequiredValue");
            if (this.oChildControls[sLabelId]) {
                return;
            }
            let oLabel = new Label(sLabelId, {
                text: "Inspection Required",
                tooltip: "Inspection Required"
            });
            let oText = new Text(sValueId, {
                text: "{path: 'customData>/isInpectionRequired'}",
                tooltip: "Is Inspection Required?"
            });
            this.oChildControls[sLabelId] = oLabel;
            oForm.addContent(oLabel);
            oForm.addContent(oText);
        }
    })
});
