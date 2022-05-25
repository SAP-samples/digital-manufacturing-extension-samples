sap.ui.define([
    "sap/m/MessageToast",
    "sap/dm/dme/podfoundation/component/production/ProductionComponent"
], function (MessageToast, ProductionComponent) {
    "use strict";

    /**
     * This plugin is a template for asynchronous POD Execution Plugin implementation. 
     * Implement business logic inside execute() method. 
     * 
     */

    var oAsynchExecutionPluginTemplate = ProductionComponent.extend("vendor.ext.executionplugins.asynchExecutionPluginTemplate.Component", {
        metadata: {
            manifest: "json"
        },

        isSynchronousExecution: function () {
            // asynchronous execution
            return false;
        },

        execute: function () {
            // show Message toast on POD screen   
            MessageToast.show("asynchExecutionPluginTemplate executed!", {
                duration: 500
            });
            // execute complete() to notify that plugin completed execution
            this.complete();
            return true;
        }
    });

    return oAsynchExecutionPluginTemplate;
});


