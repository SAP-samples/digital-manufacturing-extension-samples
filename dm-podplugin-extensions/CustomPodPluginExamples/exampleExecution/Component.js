sap.ui.define([
    "sap/dm/dme/podfoundation/component/production/ProductionComponent"
], function(ProductionComponent) {
    "use strict";

    /**
     * This plugin demonstrates how to implement an "Execution" type plugin.  The
     * Property Editor provides  a value help buttom to allow selecting an Action
     * Button which is to be executed by this plugin.  A switch describes whether
     * this plugin will run synchronously or asynchronously.  When running in
     * asynchronous mode, the plugin must tell the POD framework when it is done
     * running.  In synchronous mode, the plugin is done upon return from the
     * execute() function.
     */
    var ExecutionPlugin = ProductionComponent.extend("sap.ext.exampleplugins.exampleExecution", {
        execute: function() {
            this._initializeSettings();

            if (!this._sActionButtonId) {
                // display error message in message toast and in POD Message Popover
                this.showErrorMessage("Action Button not selected in POD Designer", true, true);
                return false;
            }

            var that = this;
            if (!this._bSynchronizedExecution) {
                // complete() must be called to end asynchronous execution
                // before call to execute button
                setTimeout(function() {
                    that.complete();
                }, 50);
            }

            // this will execute the defined button
            setTimeout(function() {
                that.executeActionButton(that._sActionButtonId);
            }, 1500);

            return true;
        },

        _initializeSettings: function() {
            var oConfiguration = this.getConfiguration();
            this._bSynchronizedExecution = true;
            this._sActionButtonId = null;
            if (oConfiguration) {
                if (typeof oConfiguration.synchronous !== "undefined") {
                    this._bSynchronizedExecution = oConfiguration.synchronous;
                }
                if (typeof oConfiguration.actionButtonId !== "undefined") {
                    this._sActionButtonId = oConfiguration.actionButtonId;
                }
            }
        }
    });

    ExecutionPlugin.prototype.isSynchronousExecution = function () {
        // when returns true, you do not have to call complete() to end execution
        return this._bSynchronizedExecution;
    };

    return ExecutionPlugin;
});