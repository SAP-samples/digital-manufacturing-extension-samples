sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/lmplugins/lineMonitorSelectionPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/dm/dme/util/PlantSettings",
    "sap/dm/dme/service/ServiceClient",
    "sap/m/Text",
    "sap/m/Column",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, PlantSettings, ServiceClient,
    Text, Column, Filter, FilterOperator, FilterType, Sorter) {
    "use strict";

    const BASE_API_PATH = "/sapdmdmepod/fnd/api-gateway-ms";

    ServiceClient = new ServiceClient();

    const oOverrideExecution = {
        onTimeRangeChange:      OverrideExecution.Before,
        onCalculateTimeRange:   OverrideExecution.After,
        onFetchCurrentShifts:   OverrideExecution.After,
        onGetCurrentOrder:      OverrideExecution.Instead,
        onOrderSelectDialogOpen: OverrideExecution.Before
    };

    const EXECUTION_STATUS_ACTIVE = "ACTIVE";

    return PluginControllerExtension.extend("sap.example.plugins.lineMonitorSelectionExtensionProvider.PluginEventExtension", {
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

        onTimeRangeChange: function(oTimeRange) {
            this._oLogUtilities.logMessage("PluginEventExtension.onTimeRangeChange: called");
        },

        onCalculateTimeRange: function(oTimeRange) {
            this._oLogUtilities.logMessage("PluginEventExtension.onCalculateTimeRange: called");

            return oTimeRange;
        },

        onFetchCurrentShifts: function(oPromise) {
            this._oLogUtilities.logMessage("PluginEventExtension.onFetchCurrentShifts: called");

            this.addShiftAssignmentDialogColumn();

            return oPromise.then((aCurrentShifts) => {
                if (this._oLogUtilities.bLogToConsole) {
                    console.debug("PluginEventExtension.onFetchCurrentShifts: promise resolved", aCurrentShifts);
                }

                // depending on which filter is used, we could be working with a list of workcenters or a single selected one
                const oPodSelectionModel = this.getController().getPodSelectionModel();
                const bWcFilterVisible = this.getCoreExtension().isWcFilterVisible();
                const aWorkcenters = bWcFilterVisible ? oPodSelectionModel.getSelectedWorkCenters() : [ oPodSelectionModel.getWorkCenter() ];

                return this.getShiftAssignmentsForWorkcenters(aWorkcenters).then((oShiftMapping) => {
                    for (const oShift of aCurrentShifts) {
                        if (oShiftMapping.hasOwnProperty(oShift.shift)) {
                            const oSet = bWcFilterVisible ? oShiftMapping[oShift.shift].workCenters : oShiftMapping[oShift.shift].resources;
                            // assign sorted array to shift for binding in the view
                            oShift._assignedTo = [ ...oSet ].sort().join(", ");
                        }
                    }
    
                    return aCurrentShifts;
                });
            });
        },

        // add a new column to the shift dialog for _assignedTo, if it hasn't already been added
        addShiftAssignmentDialogColumn: function() {
            const oDialog = this.getCoreExtension().getShiftSelectDialog();
            if (oDialog && !this._bDialogColumnAdded) {
                const iNewColIndex = 4;
                const oColumn = new Column({
                    header: new Text({
                        text: "Assigned To"
                    })
                });
                oDialog.insertColumn(oColumn, iNewColIndex);

                const oBindingInfo = oDialog.getBindingInfo("items");
                const oRowTemplate = oBindingInfo.template;
                oRowTemplate.insertCell(new Text({
                    text: `{${PluginEventConstants.LM_SELECTION_MODEL}>_assignedTo}`
                }), iNewColIndex);

                // make the dialog 10% wider to accomodate the new column
                oDialog.setContentWidth(`${parseInt(oDialog.getContentWidth()) + 10}%`);

                oDialog.bindItems(oBindingInfo);

                this._bDialogColumnAdded = true;
            }
        },

        getShiftAssignmentsForWorkcenters: function(aWorkCenters) {
            const sPlant = PlantSettings.getCurrentPlant();

            // Fetch shift assignments for each work center
            const aShiftResourceMappingPromises = aWorkCenters.map(sWorkCenter => this.getShiftAssignmentsForResources(sPlant, sWorkCenter));

            // Once all data is retrieved, build the shift mapping
            return Promise.all(aShiftResourceMappingPromises).then(aShiftResourceMappings => {
                let oShiftMapping = {};
                for (let i = 0; i < aWorkCenters.length; i++) {
                    for (const [sShift, oResourceSet] of Object.entries(aShiftResourceMappings[i])) {
                        if (!oShiftMapping[sShift]) {
                            oShiftMapping[sShift] = {
                                workCenters: new Set(),
                                resources: new Set()
                            };
                        }
                        oShiftMapping[sShift].workCenters = oShiftMapping[sShift].workCenters.add(aWorkCenters[i]);
                        oShiftMapping[sShift].resources = oShiftMapping[sShift].resources.union(oResourceSet);
                    }
                }
                return oShiftMapping;
            });
        },

        getShiftAssignmentsForResources: function(sPlant, sWorkCenter) {
            // Fetch the work center resources
            return this.getWorkCenter(sPlant, sWorkCenter)
                .then(oWorkCenter => {
                    if (!oWorkCenter) {
                        return [];
                    }
                    let aResources = oWorkCenter.members.filter(oMember => Boolean(oMember.resource)).map(oMember => oMember.resource.resource);
                    let aResourcePromises = aResources.map(sResource => this.getResource(sPlant, sResource));
                    return Promise.all(aResourcePromises);
                })
                .then(aResources => {
                    // Map shifts to resources
                    let oShifts = {};
                    for (const oResource of aResources) {
                        if (!oResource) {
                            continue;
                        }
                        for (const oShiftAssignment of oResource.shifts) {
                            const sShift = oShiftAssignment.shift;
                            if (!oShifts[sShift]) {
                                oShifts[sShift] =  new Set();
                            }
                            oShifts[sShift].add(oResource.resource);
                        }
                    }
                    return oShifts;
                });
        },

        getWorkCenter: function(sPlant, sWorkCenter) {
            // API details: https://api.sap.com/api/sapdme_plant_workcenter_v2/resource/readUsingGET
            const sUrl = `${BASE_API_PATH}/workcenter/v2/workcenters?plant=${sPlant}&workCenter=${sWorkCenter}`;
            return ServiceClient.get(sUrl).then(aResponse => aResponse?.length ? aResponse[0] : null);
        },

        getResource: function(sPlant, sResource) {
            // API details: https://api.sap.com/api/sapdme_plant_resource_v2/resource/getResourcesUsingGET_1
            const sUrl = `${BASE_API_PATH}/resource/v2/resources?plant=${sPlant}&resource=${sResource}`;
            return ServiceClient.get(sUrl).then(aResponse => aResponse?.length ? aResponse[0] : null);;
        },

        onGetCurrentOrder: function() {
            this._oLogUtilities.logMessage("PluginEventExtension.onGetCurrentOrder: called");

            return this._oExtensionUtilities.getCurrentOrder();
        },

        /**
         * Filtering and sorting must be done in an OData-friendly way to use the existing binding.
         * For more in-depth customization, create and use a non-OData model (oDialog.bindItems(oJsonModel)), then
         *    fetch all orders with this.getCoreExtension().getOrders() and filter/sort everything client-side.
         */
        onOrderSelectDialogOpen: function(oDialog) {
            this._oLogUtilities.logMessage("PluginEventExtension.onOrderSelectDialogOpen: called");

            let oBinding = oDialog.getBinding("items");

            // the custom dropdown added in LifecycleExtension lets us filter to ACTIVE or show every order regardless of execution status
            let oSelectFromOrders = this.getCoreExtension().getLmSelectionFilterBar().determineControlByName("selectFromOrders");
            if (oSelectFromOrders.getSelectedKey() === EXECUTION_STATUS_ACTIVE) {
                oBinding.filter([
                    ...oBinding.getFilters(FilterType.Application),
                    new Filter({
                        path: "executionStatus",
                        operator: FilterOperator.EQ,
                        value1: EXECUTION_STATUS_ACTIVE
                    })
                ]);
            }

            oBinding.sort([
                new Sorter({
                    path: "actualStart",
                    descending: false,
                })
            ]);
        }
    })
});
