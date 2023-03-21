sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/guidedStepsPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/MessageBox",
    "sap/ui/core/syncStyleClass",
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, MessageBox, syncStyleClass) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.guidedStepsExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_ICON_TAB_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_NEXT_BUTTON_PRESS_EVENT) {
                return OverrideExecution.Instead;
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

        onSelectionChangeEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onSelectionChangeEvent: hi");
        },

        onIconTabFilterSelectEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onIconTabFilterSelectEvent: hi");
            // TODO: check if last tab filter selected and if acknowlege is true
            // hide "Next" button and show Done button
            var oController = this.getController();
            if (!oController) {
                return;
            }
            var oView = oController.getView();
            if (!oView) {
                return;
            }
            var sItemId = oEvent.key;

            var oIconTabBar;
            if (oController && oController.getIconTabBar) {
                oIconTabBar = oController.getIconTabBar();
                if (!oIconTabBar) {
                    return;
                }
            }
            var aItems = null;
            if (oIconTabBar) {
                aItems = oIconTabBar.getItems();
            }
            if (!this.isLastItem(sItemId, aItems)) {
                return;
            }
            var oNextButton = oController.getNextButton();
            if (!oNextButton) {
                return;
            }
            var oDoneButton = oView.byId("doneButton");
            if (!oDoneButton) {
                return;
            }
            oNextButton.setVisible(false);
            oDoneButton.setVisible(true);
        },

        isLastItem : function(sItemId, aItems){
            var oLastItem = aItems[aItems.length-1];
            if (oLastItem.getId().endsWith(sItemId)) {
                return true;
            }
            return false;
        },

        onNextButtonPressEvent : function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onNextButtonPressEvent: hi");
            this.promptAcknowledgment(oEvent);
        },

        promptAcknowledgment: function(oEvent) {
            var sMessage = "Acknowledge completion of current step to move to next step.  Press cancel to remain on current step.";
            var that = this.getCoreExtension();
            var bCompact = this._isViewCompactSize();
            MessageBox.confirm(sMessage, {
                title: "Acknowledge completion of step",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that.processNextButtonPress(oEvent);
                    }
                }
            });
        },

        _isViewCompactSize: function () {
            var oController = this.getController();
            if (oController && oController.getView) {
                return !!oController.getView().$().closest(".sapUiSizeCompact").length;
            }
            return null;
        }
    })
});
