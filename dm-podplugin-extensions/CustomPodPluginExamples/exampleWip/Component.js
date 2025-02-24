sap.ui.define([
    "sap/dm/dme/podfoundation/component/production/ProductionUIComponent"
], function (ProductionUIComponent) {
    "use strict";

    /**
     * This plugin demonstrates a "View" type plugin that accepts makes
     * a call to a public API to get a list of orders, sfc's and other
     * work in process information.  It uses the Network Graph control
     * to render chart that allows for drilling down into the order
     * information. This plguin only works when a Work Center has been
     * defined in the POD Selection Model.  For that reason it is defined
     * to be used in a Work Center type POD.
     */
    return ProductionUIComponent.extend("sap.ext.exampleplugins.exampleWip.Component", {
        metadata: {
            manifest: "json"
        }
    });
});