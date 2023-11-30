sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/dcplugins/dataCollectionListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/Text"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Text) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.dataCollectionListExtensionProvider.PluginEventExtension", {

        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_OPERATION_LIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PHASE_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_DATA_COLLECTION_RENDERED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_PARAMETER_LOGGED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_REFRESH_DATA_COLLECTION_LIST_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.CREATE_DATA_COLLECTION_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_LIST_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_TABLE_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.UPDATE_COLUMN_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_COLLECT_BUTTON_PRESSED) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_MULTIPLE_COLLECT_BUTTON_PRESSED) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.SHOW_ALL_DATA_COLLECTED_MESSAGE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.LOAD_MODEL) {
                return OverrideExecution.After;
            };
            return null;
        },
        
        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        onWorklistSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectEvent: hi");
        },

        onPodSelectionChangeEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: hi");
        },

        onOperationListSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationListSelectEvent: hi");
        },

        onPhaseSelectEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPhaseSelectEvent: hi");
        },

        onDataCollectionEntryRenderedEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onDataCollectionEntryRenderedEvent: hi");
        },

        onParameterLoggedEvent: function(oLoggedData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onParameterLoggedEvent: hi");
            this._updateModel(oLoggedData.loggedData[0]);
        },

        _updateModel: function (oLoggedData) {
            let oDcGroupsModel = this.getController().getView().getModel();
            let aDcGroupList = oDcGroupsModel.getData();
            if (aDcGroupList && aDcGroupList.length > 0) {
                for (let i = 0; i < aDcGroupList.length; i++) {
                    if (aDcGroupList[i].dcGroupRef === oLoggedData.dcGroup.ref) {
                        aDcGroupList[i].lastLoggedValue = oLoggedData.parameterValues[0].parameterValue;
                        oDcGroupsModel.refresh();
                        return;
                    }
                }
            }
        },

        onRefreshDataCollectionListEvent: function(oEvent){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onRefreshDataCollectionListEvent: hi");
        },

        loadModel: function(){
            this._oExtensionUtilities.logMessage("PluginEventExtension.loadModel: hi");
            this._loadLastCollectedValues();
        },

        _loadLastCollectedValues: function () {
            let oController = this.getController();
            let oDcGroupsModel = oController.getView().getModel();
            let aDcGroupList = oDcGroupsModel.getData();
            if (aDcGroupList && aDcGroupList.length > 0) {
                let oDcGroup;
                let count = 0;
                for (let i = 0; i < aDcGroupList.length; i++) {
                    oDcGroup = aDcGroupList[i];
                    if (oDcGroup.collectedCount === 0 && !oDcGroup.allDataCollected) {
                        count++;
                        continue;
                    }
                    this.oDcGroupListItem = oController.findDcGroupListItem(oDcGroup.dcGroupRef, oDcGroup.forOperation);
                    if (!this.oDcGroupListItem) {
                        count++;
                        continue;
                    }
                    let sUri = oController.getDataCollectionRestDataSourceUri() + "datacollection/parametersInfo";
                    let that = this;
                    let iIndex = i;
                    oController.ajaxPostRequest(sUri, this.oDcGroupListItem, function(aResponseData) {
                        aDcGroupList[iIndex].lastLoggedValue = that._getLastLoggedValue(aResponseData);
                        count++;
                        if (count === aDcGroupList.length) {
                            oDcGroupsModel.refresh();
                        }
                    });
                }
            }
        },

        _getLastLoggedValue: function (aResponseData) {
            if (!aResponseData || aResponseData.length === 0) {
                return null;
            }
            let aValueList = [];
            for (let oSfcParametricItem of aResponseData) {
                if (oSfcParametricItem.parameters && oSfcParametricItem.parameters.length > 0) {
                    for (let oParameter of oSfcParametricItem.parameters) {
                        if (oParameter.actual) {
                            aValueList[aValueList.length] = {
                                actual: oParameter.actual,
                                dateCreated: oParameter.dateCreated
                            }
                        }
                    }
                }
            };
            if (aValueList.length === 0) {
                return null;
            }
            aValueList.sort(function(a, b) {
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            });
            return aValueList[0].actual;
        },
    
        createDataCollectionTable: function(oPluginConfiguration, oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.createDataCollectionTable: hi");
        },

        updateListConfiguration: function(oListConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateListConfiguration: hi");
            oListConfiguration.columns.push({
                columnId: "LAST_LOGGED",
                sequence: this.getLastLoggedColumnSequence(oListConfiguration),
                sortOrder: null,
                label: "Last Logged",
                showSort: false // to not show column in sort
            });
        },

        getLastLoggedColumnSequence: function(oListConfiguration){
            for (let oColumn of oListConfiguration.columns) {
                 if (oColumn.columnId === "PARAMETERS_BAR") {
                     return oColumn.sequence - 1;
                 }
            }
            return 1000;
        },

        updateTableConfiguration: function(oTableConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateTableConfiguration: hi");
        },

        updateColumnConfiguration: function(aColumnConfiguration){
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateColumnConfiguration: hi");

            let oTextControl = new Text({
                text: "{lastLoggedValue}",
                wrapping: false
            });

            aColumnConfiguration.push({
                columnId: 'LAST_LOGGED',
                description: 'Last Logged',
                hAlign: "Begin",
                vAlign: "Middle",
                wrapping: false,
                width: "15em",
                label: "Last Logged",
                columnListItem: oTextControl
            });
        },

        onCollectButtonPressed: function(oDcData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onCollectButtonPressed: hi");
        },

        onMultipleCollectButtonPressed: function(oSelectionData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.onMultipleCollectButtonPressed: hi");
        },

        showAllDataCollectedMessage: function(oDcData){
            this._oExtensionUtilities.logMessage("PluginEventExtension.showAllDataCollectedMessage: hi");
        }
    })
});
