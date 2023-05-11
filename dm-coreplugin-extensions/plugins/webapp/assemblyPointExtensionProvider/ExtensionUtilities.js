sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
    "use strict";
    return BaseObject.extend("sap.example.plugins.assemblyPointExtensionProvider.ExtensionUtilities", {
        constructor: function () {
            this.bClearMainInputField = false;
            this.bLogToConsole = false;
            this.bFocusToMainInputField = true;

        },
        setClearMainInputField: function(bClear) {
            this.bClearMainInputField = bClear;
        },
        setLogToConsole: function(bLogToConsole) {
            this.bLogToConsole = bLogToConsole;
        },
        setAllAssembled: function(bAssembled) {
            this.bAllAssembled = bAssembled;
        },
        focusOnMainInputField: function(oController, bOnNoSelections) {
            if (!this.bAllAssembled || !this.bClearMainInputField) {
                this.logMessage("ExtensionUtilities.focusOnMainInputField: All assembled = ", this.bAllAssembled);
                return;
            }
            if (!oController) {
                this.logMessage("ExtensionUtilities.focusOnMainInputField: Controller not found");
                return;
            }

            let oModel = oController.getPodSelectionModel();
            if (!oModel) {
                this.logMessage("ExtensionUtilities.focusOnMainInputField: PodSelectionModel not found");
            } else if (!bOnNoSelections) {
                oModel.clearSelections();
                oModel.clearDistinctSelections();
                oModel.clearSelectedRoutingSteps();
                oModel.setInputValue(null);
            } else {
                let aSelections = oModel.getSelections();
                if (aSelections && aSelections.length > 0) {
                    // contains selections, just return
                    this.logMessage("ExtensionUtilities.focusOnMainInputField: Selections in model, return");
                    return;
                }
            }

            this.logMessage("ExtensionUtilities.focusOnMainInputField: All assembled = ", this.bAllAssembled);

            oController.publish("WorklistSelectEvent", {"source": this, "selections": [], "clearInput": true, "sendToAllPages": true});
        },
        logMessage: function(sMessage, oData) {
            if (!this.bLogToConsole) {
                return;
            }
            let vDataOutput = null;
            if (typeof oData !== "undefined") {
                if (typeof oData === "string" || typeof oData === "boolean" || typeof oData === "number") {
                    vDataOutput = oData;
                } else {
                    vDataOutput = JSON.stringify(oData);
                }
            }
            if (!vDataOutput) {
                console.debug(sMessage);
            } else {
                console.debug(sMessage + vDataOutput);
            }
        }
    })
});
