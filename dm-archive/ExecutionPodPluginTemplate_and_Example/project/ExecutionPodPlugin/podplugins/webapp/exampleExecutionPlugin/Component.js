sap.ui.define([
    "sap/ui/core/MessageType",
    "sap/m/MessageToast",
    "sap/dm/dme/podfoundation/component/production/ProductionComponent",
    "sap/base/Log"
], function (MessageType, MessageToast, ProductionComponent, Log) {
    "use strict";

    /**
     * This plugin demonstrates how to implement an "Execution" type plugin. The
     * Property Editor provides  a value help button to allow selecting an Action
     * Button for Start and Complete which is to be executed by this plugin. A switch describes whether
     * this plugin will run synchronously or asynchronously. When running in
     * asynchronous mode, the plugin must tell the POD framework when it is done
     * running. In synchronous mode, the plugin is done upon return from the
     * execute() function. Operation filter controls if SFC should be processed at specific operation.  
     * Plugin business logic assumes that only one SFC is selected. 
     * 
     */

    var oLogger = Log.getLogger("exampleExecutionPlugin", Log.Level.INFO);

    var oExampleExecutionPlugin = ProductionComponent.extend("vendor.ext.executionplugins.exampleExecutionPlugin.Component", {
        metadata: {
            manifest: "json"
        },
        execute: function () {
            this.clearMessages();
            this._initializeSettings();

            // checks that POD Selection Model is not empty
            var oPodSelectionModel = this.getPodSelectionModel();
            if (!oPodSelectionModel) {
                sMessage = this.getI18nText("missingInformation");
                // display error message in message toast and in POD Message Popover
                this.showErrorMessage(sMessage, true, true);
                return false;
            }
            // trace POD Selection Model object to see content in Developer's Console window
            // oLogger.info("oPodSelectionModel: " + JSON.stringify(oPodSelectionModel));

            // Check that Start and Complete action buttons are specified
            if (!this.sActionButtonIdForStart || !this.sActionButtonIdForComplete) {
                sMessage = this.getI18nText("actionButtonIsMissed");
                // display error message in message toast and in POD Message Popover
                this.showErrorMessage(sMessage, true, true);
                return false;
            }
            // Get operation from POD Selection Model
            var aOperations = oPodSelectionModel.getOperations();
            if (!aOperations || aOperations.length === 0) {
                sMessage = this.getI18nText("missingOperation");
                this.showErrorMessage(sMessage, true, true);
                return false;
            }
            // show success message as toast and in POD Message Popover
            var sMessage = this.getI18nText("executionPluginStartedExecution", ["exampleExecutionPlugin", aOperations[0].operation]);
            this.addMessage(MessageType.Success, sMessage, "", "");
            this.showMessageToast(sMessage);

            var aSelections = oPodSelectionModel.getSelections();
            if (aSelections[0].getSfcData() && aSelections[0].getSfcData().getStatusCode()) {
                // Get SFC status code
                var sfcStatusCode = aSelections[0].getSfcData().getStatusCode();
                // SFC is already started, so let's complete it at operation
                if (sfcStatusCode === "403") {
                    if (!this.bSynchronizedExecution) {
                        // complete() must be called to end asynchronous execution before call to execute button
                        var that = this;
                        setTimeout(function () {
                            that.complete();
                        }, 50);
                    }
                    // call function to complete SFC
                    this.executeActionButtonForStartOrComplete(aOperations, this.sActionButtonIdForComplete);
                }
                // SFC is New or In Queue at operation - let's start it
                else if (sfcStatusCode === "402" || sfcStatusCode === "401") {
                    if (!this.bSynchronizedExecution) {
                        // complete() must be called to end asynchronous execution before call to execute button
                        var that = this;
                        setTimeout(function () {
                            that.complete();
                        }, 50);
                    }
                    // call function to Start SFC
                    this.executeActionButtonForStartOrComplete(aOperations, this.sActionButtonIdForStart);
                }
            }

            return true;
        },

        executeActionButtonForStartOrComplete: function (aOperations, sActionButtonId) {
            var that = this;
            setTimeout(function () {
                var bExecute = false;
                // execute based on operation filter criteria and operation name
                switch (that.sOperationFilterCriteria) {
                    case 'All operations':
                        bExecute = true;
                        break;
                    case 'Operation is':
                        if (aOperations[0].operation === that.sOperation) {
                            bExecute = true;
                        }
                        break;
                    case 'Operation is one of':
                        if (that.sOperation && that.sOperation.indexOf(aOperations[0].operation) > -1) {
                            bExecute = true;
                        }
                        break;
                    default:
                        bExecute = true;
                        break;
                }
                if (bExecute) {
                    // execute Start or Complete action here
                    that.executeActionButton(sActionButtonId);
                }
            }, 700);
        },

        _initializeSettings: function () {
            // initialize properties defined for plugin in POD Designer
            var oConfiguration = this.getConfiguration();
            //oLogger.info("oConfiguration: " + JSON.stringify(oConfiguration));
            this.bSynchronizedExecution = true;
            this.sActionButtonIdForStart = null;
            this.sActionButtonIdForComplete = null;
            this.sOperationFilterCriteria = null;
            this.sOperation = null;

            if (oConfiguration) {
                if (typeof oConfiguration.synchronous !== "undefined") {
                    this.bSynchronizedExecution = oConfiguration.synchronous;
                }
                if (typeof oConfiguration.actionButtonIdForStart !== "undefined") {
                    this.sActionButtonIdForStart = oConfiguration.actionButtonIdForStart;
                }
                if (typeof oConfiguration.actionButtonIdForComplete !== "undefined") {
                    this.sActionButtonIdForComplete = oConfiguration.actionButtonIdForComplete;
                }
                if (typeof oConfiguration.operationFilterCriteria !== "undefined") {
                    this.sOperationFilterCriteria = oConfiguration.operationFilterCriteria;
                }
                if (typeof oConfiguration.operation !== "undefined") {
                    this.sOperation = oConfiguration.operation;
                }
            }
        },
        showMessageToast: function (sMessage) {
            MessageToast.show(sMessage, {
                duration: 900
            });
        },

        isSynchronousExecution: function () {
            // when returns true, you do not have to call complete() to end execution
            return this.bSynchronizedExecution;
        }

    });
    
    return oExampleExecutionPlugin;
});


