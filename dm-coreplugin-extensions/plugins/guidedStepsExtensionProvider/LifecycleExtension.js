sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/controller/extensions/LifecycleExtensionConstants",
    "sap/m/Button",
    "sap/m/MessageBox",
    "sap/ui/core/syncStyleClass"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, Button, MessageBox, syncStyleClass) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.guidedStepsExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_BEFORE_RENDERING_PLUGIN) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_AFTER_RENDERING) {
                return OverrideExecution.After;
            } else if (sOverrideMember === LifecycleConstants.ON_EXIT) {
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
            return LifecycleConstants.EXTENSION_NAME;
        },

        onBeforeRendering : function(oData){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: hi");
            this.createDoneButton();
        },

        onBeforeRenderingPlugin : function(oData){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: hi");
        },

        onAfterRendering : function(oData){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: hi");
            this.createDoneButton();
        },

        onExit : function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: hi");
        },

        createDoneButton : function(){
            // add new Done button
            var oController = this.getController();
            if (!oController) {
                return;
            }
            var oView = oController.getView();
            if (oView) {
                var oControl = oView.byId("doneButton");
                if (oControl) {
                    // already created
                    return;
                }
            }
            if (oController && oController.getPluginPanel) {
                var oPluginPanel = oController.getPluginPanel();
                if (oPluginPanel) {
                    this.addDoneButton(oController, oPluginPanel);
                }
            }
        },

        addDoneButton: function(oController, oPluginPanel) {
            if (!oPluginPanel) {
                return;
            }
            var oToolbar = oPluginPanel.getHeaderToolbar();
            if (!oToolbar) {
                return;
            }
            var sId = "doneButton";
            var oView = oController.getView();
            if (oView) {
                sId = oView.createId(sId);
            }
            var oDoneButton = new Button(sId, {
                visible: false,
                text: "Done",
                tooltip: "Press to acknowledge completion of steps",
                icon: "",
                press: [this.onDonePress, this]
            });
            oToolbar.insertContent(oDoneButton, 4);
        },
        onDonePress: function(oEvent) {
            this.promptAcknowledgment(oEvent)
        },

        promptAcknowledgment: function(oEvent) {
            var sMessage = "Acknowledge completion of last step.  Press cancel to remain on last step.";
            var that = this;
            var bCompact = this._isViewCompactSize();
            MessageBox.confirm(sMessage, {
                title: "Acknowledge completion of step",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that.processDone(oEvent);
                    }
                }
            });
        },

        processDone: function () {
            var oView = this.getController().getView();
            var oButton = oView.byId("doneButton");
            if (oButton) {
                oButton.setVisible(false);
            }
            oButton = oView.byId("nextButton");
            if (oButton) {
                oButton.setVisible(true);
            }
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
