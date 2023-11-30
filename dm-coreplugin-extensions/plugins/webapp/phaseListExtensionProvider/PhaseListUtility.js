sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/m/Column",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer"
], function (BaseObject, Button, Text, MessageToast, Column, OverflowToolbar, ToolbarSpacer) {
    "use strict";
    return BaseObject.extend("sap.example.plugins.phaseListExtensionProvider.PhaseListUtility", {
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

        loadCustomInformation: function(bShowHelp, bShowCustomColumn){
            let oPage = this.getCoreExtension().getPluginContainer();
            
            // keeps existing controlls so they are now re-created
            if (!this.oChildControls) {
                this.oChildControls = {};
            }
            if (bShowHelp) {
                let oActionButton = null;
                if (oPage && this.oChildControls[oPage.getId() + "-actionButton"]) {
                    oActionButton = this.oChildControls[oPage.getId() + "-actionButton"];
                }
                if (oPage && !oActionButton) {
                    this.addActionButton(oPage);
                }
            }
            if (bShowCustomColumn) {
                let oTableColumns = null;
                if (this.oChildControls[oPage.getId() + "-tableColumns"]) {
                    oTableColumns = this.oChildControls[oPage.getId() + "-tableColumns"];
                }
                if (!oTableColumns) {
                    this.addTableColumns(oPage);
                }
            }
        },

        addActionButton: function(oPage) {
            oPage.setShowHeader(true);
            let that = this;
            let oActionButton = new Button({
                type: "Emphasized",
                text: "Help",
                press: [that.onHelpPress, that]
            });
            let oHeaderToolbar = new OverflowToolbar();
            oHeaderToolbar.addContent(new ToolbarSpacer());
            oHeaderToolbar.addContent(oActionButton);
            oPage.setCustomHeader(oHeaderToolbar);
            this.oChildControls[oPage.getId()] = oActionButton;
        },
		onHelpPress: function (evt) {
			MessageToast.show("Custom Help button pressed");
		},

        addTableColumns: function(oPage) {
            let oTable = this.getCoreExtension().getPluginTable();
            this.addNewColumn(oTable, "Custom Data");//, 2);
            let oText = new Text({"text": "{customText}"});
            this.addColumnListItem(oTable, oText);//, 2);
            this.oChildControls[oPage.getId() + "-tableColumns"] = true;
        },

        addNewColumn: function(oTable, sColumnHeaderText, iIndex) {
            let oColumn = new Column({
                hAlign: "Center",
                width: "6em"
            });
            oColumn.setHeader(new Text({"text": sColumnHeaderText}));
            if (typeof iIndex === "undefined") {
                oTable.addColumn(oColumn);
            } else {
                oTable.insertColumn(oColumn, iIndex);
            }
        },

        addColumnListItem: function(oTable, oControl, iIndex) {
            let oBindingInfo  = oTable.getBindingInfo("items");
            let oTemplate =  oBindingInfo.template;
            let oSorter =  oBindingInfo.sorter;
            let oGroupHeaderFactory =  oBindingInfo.groupHeaderFactory;
            let aColumns = oTable.getColumns();
            let aCells = oTemplate.getCells();
            if (typeof iIndex === "undefined") {
                oTemplate.addCell(oControl);
            } else {
                oTemplate.insertCell(oControl, iIndex);
            }
            oTable.unbindAggregation("items");
            oTable.bindItems({
                path : "/",
                template : oTemplate,
                sorter: oSorter,
                groupHeaderFactory: oGroupHeaderFactory
            });
        }
    })
});
