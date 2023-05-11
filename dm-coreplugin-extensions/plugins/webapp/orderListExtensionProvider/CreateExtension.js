sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/dm/dme/plugins/orderSelectionListPlugin/controller/extensions/CreateExtensionConstants",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/Text"
], function (PluginControllerExtension, CreateConstants, OverrideExecution, Text) {
    "use strict";

    return PluginControllerExtension.extend("sap.example.plugins.orderListExtensionProvider.CreateExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === CreateConstants.CREATE_ORDERLIST_TABLE) {
                return OverrideExecution.Before;
            } else if (sOverrideMember === CreateConstants.ENHANCE_ORDERLIST_TABLE) { 
                return OverrideExecution.After; 
            } else if (sOverrideMember === CreateConstants.CREATETOOLBAR) { 
                return OverrideExecution.After; 
            } else if (sOverrideMember === CreateConstants.LOAD_ORDERLIST_TABLE) { 
                return OverrideExecution.After; 
            } else if (sOverrideMember === CreateConstants.LOAD_ORDERLIST_COUNT) { 
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
         createOrderListTable: function (oData) { 
            let that = this;
            this._oExtensionUtilities.logMessage("CreateExtension.createOrderListTable: hi");
            let sPlant = this.getController().getPodController().getUserPlant();
            let oOrderTextControl = new Text().bindProperty("text", { 
                parts: [{
                    path: "order", type: new sap.ui.model.type.String()
                }], 
                formatter: function (sOrder) {  
                    let returnValue = parseInt(Math.random()* Math.pow(10,2));
                    let sUrl = this.getController().getPublicApiRestDataSourceUri() + 'order/v1/orders?plant='+ sPlant +'&order=' + sOrder;
                    this._ajaxSyncGetRequest(sUrl, null,
                        function (oResponseData) {
                            if(oResponseData.customValues.length){
                                returnValue = oResponseData.customValues[0].value;
                            }
                        },
                        function (oError, sHttpErrorMessage) {
                            let err = oError || sHttpErrorMessage;
                            that._oExtensionUtilities.logMessage("Unable to get Custom Data Value");
                            returnValue = 'ERROR';
                    });

                    return returnValue;
                }.bind(this) 
            });
            
            oData.columnConfiguration.push({ 
                columnId: 'CUSTOM_DATA', 
                description: 'CUSTOM_DATA',  
                hAlign: "End",  
                vAlign: "Middle", 
                wrapping: false, 
                width: "15em", 
                label: "CUSTOM_DATA", 
                columnListItem: oOrderTextControl
            }); 
            
            oData.listConfiguration.columns.push({
                columnId: 'CUSTOM_DATA', 
                sequence: 200, 
                sortOrder: null
            }) 
            
            return oData; 
        },

        /**
         * Enhances the Table to add additional controls (i.e.; Toolbar, etc)
         *
         * @param {object} oTable Table control to update
         * @param {object} oListConfiguration List configuration used to create the table
         * @public
         */
        enhanceOrderListTable: function (oTable, oListConfiguration) {
            this._oExtensionUtilities.logMessage("CreateExtension.enhanceOrderListTable: hi");
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
        loadOrderList: function (bIgnoreErrors, vInputSfc) {
            this._oExtensionUtilities.logMessage("CreateExtension.loadOrderList: hi");
        },

        /**
         * Retrieves the orderlist count and loads it into the "view" model for display:
         * <pre>
         *     this.base.getView().getModel("view").setProperty("/listSize", iCount);
         * </pre>
         *
         * @param {object} vInputSfc Array of SFC's or single SFC to search by
         * @public
         */
        loadOrderListCount: function (vInputSfc) {
            this._oExtensionUtilities.logMessage("CreateExtension.loadOrderListCount: hi");
        },

        _ajaxSyncGetRequest: function (sUrl, sParams, fnSuccessCallback, fnErrorCallback) {
            jQuery.ajax({
                url: sUrl,
                success: fnSuccessCallback,
                error: fnErrorCallback,
                async: false
            });
        },
    })
});
