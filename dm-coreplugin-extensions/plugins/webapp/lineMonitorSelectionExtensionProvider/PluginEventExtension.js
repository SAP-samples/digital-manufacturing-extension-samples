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
                let aWorkcenters;
                const oPodSelectionModel = this.getController().getPodSelectionModel();
                if (this.getCoreExtension().isWcFilterVisible()) {
                    aWorkcenters = oPodSelectionModel.getSelectedWorkCenters();
                } else {
                    aWorkcenters = [ oPodSelectionModel.getWorkCenter() ];
                }

                return this.getShiftAssignmentsForWorkcenters(aWorkcenters).then((oShiftMapping) => {
                    for (const oShift of aCurrentShifts) {
                        if (oShiftMapping.hasOwnProperty(oShift.ref) && oShiftMapping[oShift.ref].size) {
                            // assign sorted array to shift for binding in the view
                            oShift._assignedTo = [ ...oShiftMapping[oShift.ref] ].sort().join(", ");
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

        getShiftAssignmentsForWorkcenters: function(aWorkcenters) {
            const sPlant = PlantSettings.getCurrentPlant();
            const aWorkcenterRefs = aWorkcenters.map(sWorkcenter => `'WorkCenterBO:${sPlant},${sWorkcenter}'`);
            const sUrl = `/dme/plant.svc/Workcenters?$filter=ref in (${aWorkcenterRefs.join(",")})&$select=ref,plant,workcenter&$expand=members($select=ref;$expand=childResource($select=ref,resource;$expand=resourceShifts($expand=shift($select=ref,shift))))`;
            return ServiceClient.get(sUrl).then((oResponse) => {
                const oShiftMapping = {};

                if (oResponse && Array.isArray(oResponse.value)) {
                    for (const oWorkcenter of oResponse.value) {
                        for (const oMember of oWorkcenter.members) {
                            if (oMember.childResource && Array.isArray(oMember.childResource.resourceShifts)) {
                                for (const oShiftAssignment of oMember.childResource.resourceShifts) {
                                    // index the mapping by shift ref
                                    // use a Set to prevent duplicates in the list
                                    const oShift = oShiftAssignment.shift;
                                    if (!oShiftMapping[oShift.ref]) {
                                        oShiftMapping[oShift.ref] = new Set();
                                    }

                                    // if on the overview page, list the work centers
                                    if (this.getCoreExtension().isWcFilterVisible()) {
                                        oShiftMapping[oShift.ref].add(oWorkcenter.workcenter);
                                    } else {
                                        // list the resources on the details page
                                        oShiftMapping[oShift.ref].add(oMember.childResource.resource);
                                    }
                                }
                            }
                        }
                    }
                }

                return oShiftMapping;
            });
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
