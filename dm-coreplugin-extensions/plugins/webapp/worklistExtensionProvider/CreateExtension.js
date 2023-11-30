sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/dm/dme/plugins/worklistPlugin/controller/extensions/CreateExtensionConstants",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/Text",
    "sap/dm/dme/podfoundation/util/PodUtility"
], function (PluginControllerExtension, CreateConstants, OverrideExecution, Text, PodUtility) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.worklistExtensionProvider.CreateExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function(sOverrideMember) {
            if (sOverrideMember === CreateConstants.CREATE_WORKLIST_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.ENHANCE_WORKLIST_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.GET_TABLE_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.GET_LIST_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.GET_COLUMN_CONFIGURATION) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.CREATE_TOOLBAR) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.LOAD_WORKLIST_TABLE) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.LOAD_WORKLIST_COUNT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === CreateConstants.UPDATE_SEARCH_FILTER) {
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
            return CreateConstants.EXTENSION_NAME;
        },

        /**
         * Creates a table based on input list configuration data
         *
         * @param {object} oData Data dependent on type of Override
         * <pre>
         *     Override.Instead: List configuration from DB
         *     Override.Before: Configuration data used to create table:
         *          {
         *              tableConfiguration: oTableConfiguration,
         *              columnConfiguration: aColumnConfiguration,
         *              listConfiguration: oListConfiguration,
         *              columnListItemMetadata: oColumnListItemMetadata
         *          }
         *     Override.After: See return object below
         * </pre>
         * @returns {object} Object containing following data:
         *<pre>
         *   {
         *        table: Table,
         *        columnListItem: ColumnListItem,
         *        listConfiguration: Object containing List Configuration data
         *   }
         *</pre>
         * @throws Error if error occurs during table creation
         * @public
         */
        createWorklistTable: function (oData) {
            this._oExtensionUtilities.logMessage("CreateExtension.createWorklistTable: hi");
            return oData;
        },

        /**
         * Enhances the Table to add additional controls (i.e.; Toolbar, etc)
         *
         * @param {object} oTable Table control to update
         * @param {object} oListConfiguration List configuration used to create the table
         * @public
         */
        enhanceWorklistTable: function (oTable, oListConfiguration) {
            this._oExtensionUtilities.logMessage("CreateExtension.enhanceWorklistTable: hi");
        },

        /**
         * Updates the configuration options for the Table
         *
         * @param {object} oTableConfiguration Table configuration settings
         * @returns {object} Updated Table configuration
         * @public
         */
        getTableConfiguration: function (oTableConfiguration) {
            this._oExtensionUtilities.logMessage("CreateExtension.getTableConfiguration: hi ");
            return oTableConfiguration;
        },

        /**
         * Updates the the list configuration settings used to create the table
         *
         * @param {object} oListConfiguration List configuration settings
         * @returns {object} Updated List configuration settings
         * @public
         */
        getListConfiguration: function (oListConfiguration) {
            oListConfiguration.columns.push({
                columnId: 'CUSTOM_DATA',
                sequence: 60,
                sortOrder: null,
                label: "Custom Data",
                // binding: "{sfc}",
                showSort: false // to not show column in sort
            })
            this._oExtensionUtilities.logMessage("CreateExtension.getTableConfiguration: hi");
            return oListConfiguration;
        },

        /**
         * Updates the column configuration data used to create the table
         *
         * @param {object} aColumnConfiguration List of Columns to update
         * @returns {object} Updated column configuration for Override.Instead
         * @public
         */
        getColumnConfiguration: function (aColumnConfiguration) {
            let that = this;
            let oTextControl = new Text().bindProperty("text", {
                parts: [
                    {path: "sfc", type: new sap.ui.model.type.String()}
                ],
                formatter: function (sSfc) {
                    return that._oExtensionUtilities.getCustomDataForSfc(that.getController(), sSfc);
                }.bind(this),
                wrapping: false
            });

            aColumnConfiguration.push({
                columnId: 'CUSTOM_DATA',
                description: 'Custom Data',
                hAlign: "Begin",
                vAlign: "Middle",
                wrapping: false,
                width: "15em",
                label: "Custom Data",
                // binding: "{sfc}",
                columnListItem: oTextControl
            });

            return aColumnConfiguration;
        },

        /**
         * Creates The Toolbar for the table
         *
         * @param {object} oData Data dependent on type of Override
         * <pre>
         *     Override.Instead & Before: No Arguments passed
         *     Override.After: sap.m.Toolbar to enhance
         * </pre>
         * @returns {sap.m.Toolbar} Toolbar
         * @public
         */
        createToolbar: function (oToolbar) {
            this._oExtensionUtilities.logMessage("CreateExtension.createToolbar: hi");
            return oToolbar;
        },

        /**
         * Binds the list table to the URL used to retrieve the SFC's.  
         *
         * @param {boolean} bIgnoreErrors true to ignore errors, else false
         * @param {object} vInputSfc Array of SFC's or single SFC to search by
         * @public
         */
        loadWorklist: function (bIgnoreErrors, vInputSfc) {
            this._oExtensionUtilities.logMessage("CreateExtension.loadWorklist: hi");
        },

        /**
         * Retrieves the worklist count and loads it into the "view" model for display:
         * <pre>
         *     this.base.getView().getModel("view").setProperty("/listSize", iCount);
         * </pre>
         *
         * @param {object} vInputSfc Array of SFC's or single SFC to search by
         * @public
         */
        loadWorklistCount: function (vInputSfc) {
            this._oExtensionUtilities.logMessage("CreateExtension.loadWorklistCount: hi");
        },

        /**
         * Allows modifying input search filter for use in loading worklist. This function
         * can be overriden by custom extensions as follows for OverrideExecution.Instead,
         * OverrideExecution.Before and OverrideExecution.After.
         * <p>
         * Only SFC, Shop Order or Process Lot can be used in a search filter using
         * the following format:
         * <pre>
         *    sfc,SFC001  (SFC)
         *    pl,PL001  (Process lot)
         *    ordr,SO001  (Shop Order)
         * </pre>
         * The input search filter might already have something defined (i.e.; "sfc,SFC001") so be carfule
         * before replacing it.  Only one of the filters are allowed to be returned (i.e. multiples not supported)
         *
         * @param {string} sSearchFilter
         * @returns {string} search filter to use
         * @public
         */
        updateSearchFilter: function (sSearchFilter) {
            let oPodSelectionModel = this.getController().getPodSelectionModel();
            if (oPodSelectionModel && oPodSelectionModel.customData && 
                PodUtility.isNotEmpty(oPodSelectionModel.customData.shopOrder)) {
                return "ordr," + oPodSelectionModel.customData.shopOrder;
            }
            return sSearchFilter;
        }
    })
});
