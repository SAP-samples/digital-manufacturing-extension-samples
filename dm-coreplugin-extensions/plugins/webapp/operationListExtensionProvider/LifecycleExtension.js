sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/podfoundation/controller/extensions/LifecycleExtensionConstants",
    "sap/m/Button",
	"sap/m/MessageBox"
], function (PluginControllerExtension, OverrideExecution, LifecycleConstants, Button, MessageBox) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.operationListExtensionProvider.LifecycleExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._bInitialized = false;
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

        setPluginEventExtension: function(oExtension){
            this.oPluginEventExtension = oExtension;
        },

        getCorePluginExtension: function(){
            return this.oPluginEventExtension.getCoreExtension();
        },

        onBeforeRendering: function(oEvent){
            if (!this._bInitialized) {
                let oConfiguration = this.getController().getConfiguration();
                if (oConfiguration) {
                    if (typeof oConfiguration.logToConsole !== "undefined") {
                        this._oExtensionUtilities.setLogToConsole(oConfiguration.logToConsole);
                    } else {
                        this._oExtensionUtilities.setLogToConsole(false);
                    }
                }
            }
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRendering: Operation List extension");
        },

        onBeforeRenderingPlugin: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onBeforeRenderingPlugin: Operation List extension");
        },

        onAfterRendering: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onAfterRendering: Operation List extension");
            let that = this;
            setTimeout(function() {
                that.loadToolbar(that.onPrintPress, that);
            }, 1000);
        },

        onExit: function(oEvent){
            this._oExtensionUtilities.logMessage("LifecycleExtension.onExit: Operation List extension");
        },

        loadToolbar: function(fnFunction, fnContext){
            let bShowPrint = this.getCorePluginExtension().getConfigurationValue("showPrint");
            if (bShowPrint) {
                let oTable = this.getCorePluginExtension().getPluginTable();
                let oToolbar = oTable.getHeaderToolbar();
                this.addActionButton(oToolbar, "Emphasized", "Print", fnFunction, fnContext);
            }
        },

        addActionButton: function(oToolbar, sType, sText, fnFunction, fnContext) {
            let oActionButton = new Button({
                type: sType,
                text: sText,
                press: [fnFunction, fnContext]
            });
            oToolbar.addContent(oActionButton);
        },

		onPrintPress: function (oEvent) {
            let oView = this.getController().getView();
            let oModel = oView.getModel();
            let aOperations = oModel.getData().Operations;
            let sDetails = "No operations";
            if (aOperations && aOperations.length > 0) {
                let sRow, sNewLine = "";
                sDetails = "";
                for (let oOperation of aOperations) {
                    if (sDetails.length > 0) {
                        sNewLine = "\n";
                    }
                    sRow = `Operation: ${oOperation.operation}/${oOperation.operationRevision}, Step: ${oOperation.stepId}, Custom Text: ${oOperation.customText}`;
                    sDetails = sDetails + sNewLine + sRow;
                }
            }
            this.showMessage("Print Operations", "Select to print operations", sDetails);
		},

		showMessage: function (sTitle, sMessage, sDetails) {
			MessageBox.information(sMessage, {
				title: sTitle,
				id: "messageBoxId1",
				details: sDetails,
				contentWidth: "400px"
			});
		}
    })
});
