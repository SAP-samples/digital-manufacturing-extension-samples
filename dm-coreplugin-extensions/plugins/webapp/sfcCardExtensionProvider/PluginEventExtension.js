sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/headerInformationPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/MessageToast",
    "sap/ui/layout/VerticalLayout"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Button, Label,
             MessageToast, VerticalLayout) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.sfcCardExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_QUANTITY_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PAGE_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.REFRESH_HEADER_INFORMATION) {
                return OverrideExecution.After;
            };
            return null;
        },
        
        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        onSelectionChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSelectionChangeEvent: hi");
        },

        onQuantityChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onQuantityChangeEvent: hi");
        },

        onPageChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPageChangeEvent: hi");
        },

        refreshHeaderInformation: function(bInitialLoading){
            this._oExtensionUtilities.logMessage("PluginEventExtension.refreshHeaderInformation: bInitialLoading = " + bInitialLoading);
            let oConfigurationData, oData;
            let oConfigurationModel = this.getCoreExtension().getInformationConfigurationModel();
            if (oConfigurationModel) {
                oConfigurationData = oConfigurationModel.getData();
            }
            let oDataModel = this.getCoreExtension().getInformationDataModel();
            if (oDataModel) {
                oData = oDataModel.getData();
            }
            let oPluginContainer = this.getCoreExtension().getPluginContainer();
            let oInformationContainer = this.getCoreExtension().getPluginInformationContainer();
            let oToolbarContainer = this.getCoreExtension().getPluginToolbar();
            
            // Multiple SFC Card's can be defined, but only one extension, so
            // this will make sure new controls are created and added to the current displayed
            // SFC Card plugin

            if (!this.oChildControls) {
                this.oChildControls = {};
            }
            let oActionButton = null;
            if (oToolbarContainer && this.oChildControls[oToolbarContainer.getId()]) {
                oActionButton = this.oChildControls[oToolbarContainer.getId()];
            }
            if (oToolbarContainer && !oActionButton) {
                this.addActionButton(oToolbarContainer);
            }
            let oInformationControl = null;
            if (oInformationContainer && this.oChildControls[oInformationContainer.getId()]) {
                oInformationControl = this.oChildControls[oInformationContainer.getId()];
            }
            if (oInformationContainer && !oInformationControl) {
                this.addInformationControls(oInformationContainer);
            }
        },

        addActionButton: function(oToolbar) {
            let that = this;
            let oActionButton = new Button({
                type: "Emphasized",
                text: "Help",
                press: [that.onHelpPress, that]
            });
            oToolbar.addContent(oActionButton);
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
                text: "Custom Data",
                tooltip: "Custom Data Information"
           });
           let oLabelData = new Label({
                text: "Testing",
                tooltip: "Testing station"
           });
           oInformationControl.addContent(oLabel);
           oInformationControl.addContent(oLabelData);
           oInformationContainer.addItem(oInformationControl);
           this.oChildControls[oInformationContainer.getId()] = oInformationControl;
        }
    })
});
