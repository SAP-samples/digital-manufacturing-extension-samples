sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
    "use strict";

    return BaseObject.extend("sap.example.plugins.speedlossExtensionProvider.ExtensionUtilities", {
        constructor: function () {
            this.bLogToConsole = false;
        },

        setLogToConsole: function (bLogToConsole) {
            this.bLogToConsole = bLogToConsole;
        },

        logMessage: function (sMessage, oData) {
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
