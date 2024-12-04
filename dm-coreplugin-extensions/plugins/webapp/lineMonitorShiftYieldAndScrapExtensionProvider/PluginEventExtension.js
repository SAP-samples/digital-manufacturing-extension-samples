sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/shiftYieldAndScrapPlugin/controller/extensions/PluginEventExtensionConstants"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants) {
    "use strict";

    const oOverrideExecution = {
        onFilterResources: OverrideExecution.Before,
        onGetInitialResource: OverrideExecution.Instead,
        onGetCardData: OverrideExecution.After
    };

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorShiftYieldAndScrapExtensionProvider.PluginEventExtension", {
        constructor: function(oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
            this._aResources = null;
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
            this._aResources = aResources;

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
         * OverrideExecution.After handler for onGetCardData.
         * Using OverrideExecution.Instead would prevent the default API call from occurring, meaning all data would have to be fetched here.
         *
         * This function is provided the Promise from the default API call.
         * Properties of the original response can be modified or added to.
         * Separate API calls can also be made here to fetch additional data to be added to the resolved object.
         *
         * This function must return a promise that resolves to the object used for model binding.
         */
        onGetCardData: function(oFilters, oPromise) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onGetCardData: called");

            // This example uses OverrideExecution.After, so oPromise will resolve to the aggregated data for the currently selected resource
            return oPromise.then((oData) => {
                this._oExtensionUtilities.logMessage("PluginEventExtension.onGetCardData: promise resolved");

                oData.content.forEach(a => a.phaseDescription = `Resource ${oFilters.selectedResource} - ${a.phaseDescription}`);

                // We can also fetch aggregated data for another resource, then combine or modify the results.
                // In this example, another resource is chosen arbitrarily.
                let sResource2 = this._aResources.map(o => o.resource.resource).find(s => s !== oFilters.selectedResource);
                if (!sResource2) {
                    return oData;
                }
                return this.getCoreExtension().getYieldAndScrapData(oFilters.plant, oFilters.workCenter, sResource2,
                    oFilters.material.material, oFilters.material.materialVersion, oFilters.timeRange.start, oFilters.timeRange.end
                ).then(oResource2Data => {
                    oResource2Data.content.forEach(a => a.phaseDescription = `Resource ${sResource2} - ${a.phaseDescription}`);
                    return {
                        content: oData.content.concat(oResource2Data.content)
                    };
                });
            });
        }
    })
});
