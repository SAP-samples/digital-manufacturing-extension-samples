sap.ui.define([
    "sap/dm/dme/podfoundation/component/production/ProductionUIComponent"
], function(ProductionUIComponent) {
    "use strict";

    /**
     * This plugin demonstrates a "View" type plugin that accepts "custom"
     * notifications.  The  Property Editor provides a switch that will enable
     * or disable notifications for the plugin.  The view for this plugin
     * displays various information that is currently defined in the POD
     * Selection Model.  It also provides a text area that will display
     * any the notification messages received from the back end microservice.
     */
    var Component = ProductionUIComponent.extend("sap.ext.exampleplugins.exampleView.Component", {
        metadata : {
            manifest : "json"
        }
    });

    return Component;
});