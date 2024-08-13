sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/indicatorActualValuePlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onIndicatorValueModification: OverrideExecution.Instead
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorLastIndicatorValueExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities, oLogUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._oLogUtilities = oLogUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (oOverrideExecution.hasOwnProperty(sOverrideMember)) {
                return oOverrideExecution[sOverrideMember];
            }
            return null;
        },

        getExtensionName: function() {
            return PluginEventConstants.EXTENSION_NAME;
        },


        /**
         * Object used to provide indicator context to the onIndicatorValueModification event
         * @typedef {Object} IndicatorData 
         * @property {String} workcenter - Work Center name 
         * @property {String} assetName - Name of the indicator asset
         * @property {String} indicatorName - Name of the indicator
         * @property {String} structurePath - Indicator Structure Path 
         * @property {Number} timestamp - Timestamp of the indicator value
         * @property {String} value - Value of the indicator
         * @property {String} valueState - Value State of the indicator
         *             - One of 'Information', 'Error', 'Warning', 'Success', or 'None'
         * @property {String} uom - Unit of Measure for the indicator value
         */
        /**
         * Object returned from onIndicatorValueModification event
         * @typedef {Object} IndicatorModificationResponse 
         * @property {String} value - Modified indicator value
         * @property {String} valueState - Modified value State
         *          - One of 'Information', 'Error', 'Warning', 'Success', or 'None'
         * @property {String} uom - Modified unit of measure for the indicator value
         */

        /**
         * OverrideExecution.Instead handler for onIndicatorValueModification
         * @param {IndicatorData} oIndicatorData - Incoming indicator value context data
         * @returns {IndicatorModificationResponse} - Modified indicator attributes
         * This function allows for custom modification of the indicator values displayed in the Line Monitor Last Indicator Value plugin.
         * This includes the ability to change the following indicator value attributes:
         *       {String} value - Indicator value 
         *       {String} valueState - Value State of the Indicator
         *       {String} uom - Unit of Measure for the Indicator Value
         * 
         * For proper context, this event handler is passed an object of type IndicatorData (defined above as a typedef).  
         * The fields of this context object can be used to provide custom logic for modifiying the indicator data.  
         * This can be used for: 
         *     - Value conversion
         *     - Unit of measure conversion
         *     - Changing the Value State which determines the UI5 semantic color used to display the indicator within the plugin
         *  
         * To modify the indicator, this function must return an object of type IndicatorModificationResponse.  
         * All IndicatorModificationResponse fields are optional.  The plugin will only override indicator attributes that 
         * are provided a non-null value in the response object.  
         * 
         * This example will look for all indicators that have names containing 'Temperature' and have a unit of measure of '°C'.
         * Once found, the extension will modify the indicator with the following logic:
         *      - Convert the value from °C to °F
         *      - Change uom to °F
         *      - Change valueState to 'Error' (Red) if the converted value > 200
         *      - Change valueState to 'Success' (Green) if the converted value <= 200
         */
        onIndicatorValueModification: function (oIndicatorData) {

            if ( oIndicatorData["indicatorName"].includes("Temperature") &&
                 oIndicatorData["uom"] === "°C"
            ) {
                const nValueInCelsius = parseFloat(oIndicatorData["value"]);
                if ( !isNaN(nValueInCelsius) ) {
                    const nValueInFahrenheit = ((nValueInCelsius * 9/5) + 32).toFixed(2);

                    let oResponse = new Object();
                    oResponse["value"] = nValueInFahrenheit;
                    oResponse["uom"] = "°F";
                    if ( nValueInFahrenheit > 200 ) {
                        oResponse["valueState"] = "Error";
                    } else {
                        oResponse["valueState"] = "Success";
                    }

                    return oResponse;

                } else {
                    Log.error("The custom extension has encountered a non-numeric value ({0}) for a Temperature.\nIndicator context data:\n{1}" [nValueInCelsius, JSON.stringify(oIndicatorData)] );
                }
            }

        }

    })
});
