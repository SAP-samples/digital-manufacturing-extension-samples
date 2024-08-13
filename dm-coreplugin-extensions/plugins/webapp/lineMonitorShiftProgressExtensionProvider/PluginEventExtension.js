sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/shiftProductionCardPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onFilterResources: OverrideExecution.Before,
        onGetInitialResource: OverrideExecution.Instead,
        onCardDataRetrieved: OverrideExecution.Instead
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorShiftProgressExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
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


        /*
         * OverrideExecution.Before handler for onFilterResources.
         *
         * This function takes an array of resource objects.
         * The array can be filtered to remove resources that should not be displayed in the plugin.
         *
         * This function must return the array of resources or a promise that resolves to the array of resources.
         */
        onFilterResources: function(aResources) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onFilterResources: called");

            // The list can be filtered to only display resources which are monitoring-relevant.
            // Note that the source array needs to be modified for filtering to take effect.
            let i = aResources.length
            while (i--) {
                if (!aResources[i].monitoringRelevant) { 
                    aResources.splice(i, 1);
                } 
            }
            return aResources;
        },


        /*
         * OverrideExecution.Instead handler for onGetInitialResource.
         *
         * This function takes an array of resource objects.
         * A resource in the list can be selected as the initial resource to be displayed in the plugin.
         *
         * This function must return the resource ID or a promise that resolves to the resource ID which should be initially selected.
         */
        onGetInitialResource: function(aResources) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onGetInitialResource: called");

            // Initially select the first scheduling-relevant resource which is found. If none are found, default to the first resource.
            let oResource = aResources.find(oResource => oResource.schedulingRelevant) || aResources[0];
            return oResource.resource.resource;
        },

        /*
         * OverrideExecution.Instead handler for onCardDataRetrieved.
         *
         * This function takes the card data object which is used by the model binding.
         * Properties of the card data can be modified or added to but should not be removed.
         *
         * This function must return the card data object or a promise that resolves to the card data object.
         */
        onCardDataRetrieved: function(oCardData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCardDataRetrieved: called");

            // Values displayed in the plugin can be altered based on custom logic. For example, a custom delta quantity calculation can be implemented.
            oCardData.shiftProgress.currentTargetQuantity = this.calculateCurrentTarget(oCardData.shiftProgress);
            oCardData.shiftProgress.deltaQuantity = oCardData.shiftProgress.yieldQuantity - oCardData.shiftProgress.currentTargetQuantity;
            if (oCardData.shiftProgress.hourProgress) {
                for (let oHourProgress of oCardData.shiftProgress.hourProgress) {
                    oHourProgress.currentTargetQuantity = this.calculateCurrentTarget(oHourProgress);
                    oHourProgress.deltaQuantity = oHourProgress.yieldQuantity - oHourProgress.currentTargetQuantity;
                }
            }

            // Numeric values can be rounded using the helper function formatNumericCardValues.
            const iDecimalPlaces = 1;
            this.getCoreExtension().formatNumericCardValues(oCardData, iDecimalPlaces);

            return oCardData;
        },
        
        calculateCurrentTarget: function(oProgressData) {
            // In this example, current target is calculated based on the time elapsed since the start of the shift.
            let iTotalDurationMillis = new Date(oProgressData.endTime) - new Date(oProgressData.startTime);
            let iCurrentDurationMillis = new Date() - new Date(oProgressData.startTime);
            return oProgressData.targetQuantity * iCurrentDurationMillis / iTotalDurationMillis;
        }
    })
});
