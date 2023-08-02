sap.ui.define([
    "sap/ui/base/Object",
    "sap/example/plugins/resourceStatusExtensionProvider/control/ConfigurableListButton"
], function (BaseObject, ConfigurableListButton) {
    "use strict";

    /**
     * Get the object needed to instantiate a control with the same settings as oControl.
     *
     * Can be used to apply the properties of one control to a new instance of a
     * different control (such as making a custom ConfigurableListButton with the same
     * properties, bindings, and events as the original sap.m.Button it replaced).
     */
    function getSettingsForControl(oControl, oController) {
        let oProperties = oControl.getMetadata().getAllProperties();

        let oValues = {};
        for (let sProp in oProperties) {
            // if the property has an associated binding, keep it
            if (oControl.getBindingInfo(sProp)) {
                oValues[sProp] = oControl.getBindingInfo(sProp);
            } else {
                // no binding, use the literal value
                oValues[sProp] = oControl.getProperty(sProp);
            }
        }

        // keep event handlers
        let oEvents = oControl.getMetadata().getAllEvents();
        for (let sEvent in oEvents) {
            if (oControl.mEventRegistry[sEvent]) {
                oValues[sEvent] = oControl.mEventRegistry[sEvent].map(oEvent => oEvent.fFunction.bind(oController));
            }
        }

        return oValues;
    };

    return BaseObject.extend("sap.example.plugins.resourceStatusExtensionProvider.ExtensionUtilities", {
        constructor: function () {
            this.bLogToConsole = false;
        },

        setLogToConsole: function(bLogToConsole) {
            this.bLogToConsole = bLogToConsole;
        },

        logMessage: function(sMessage, oData) {
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
        },

        /**
         * oTable sap.m.Table The table to add a column to.
         * oNewColHeader sap.m.Column The header for the new column.
         * oNewColCell sap.ui.core.Control The cell control to be used for each row of the table.
         * iIndex integer (optional) The position of the new column. If omitted, the new column will be inserted at the end of the column list.
         */
        addColumnToTable: function(oTable, oNewColHeader, oNewColCell, iIndex) {
            let oBindingInfo = oTable.getBindingInfo("items");
            let oRowTemplate = oBindingInfo.template;

            if (typeof(iIndex) === "undefined") {
                oTable.addColumn(oNewColHeader);
                oRowTemplate.addCell(oNewColCell);
            } else {
                oTable.insertColumn(oNewColHeader, iIndex);
                oRowTemplate.insertCell(oNewColCell, iIndex);
            }

            // modifying the template in-place does nothing until rebound
            oTable.bindItems(oBindingInfo);
        },

        /**
         * Replace any sap.m.Button cells with our custom ConfigurableListButton
         * while keeping the same properties, bindings, and event listeners
         */
        replaceListButtons: function(oTable, sButtonHeight, oController) {
            let oBindingInfo = oTable.getBindingInfo("items");
            let oRowTemplate = oBindingInfo.template;
            let aCells = oRowTemplate.getCells();
            let aCellIndices = [];

            // find all cells with buttons
            for (let i = 0; i < aCells.length; i++) {
                if (aCells[i].getMetadata().getElementName() === "sap.m.Button") {
                    aCellIndices.push(i);
                }
            }

            // for each button, replace it with a custom ConfigurableListButton
            for (let i = 0; i < aCellIndices.length; i++) {
                let iCellIndex = aCellIndices[i];
                let oCellSettings = getSettingsForControl(aCells[iCellIndex], oController);

                let oNewButton = new ConfigurableListButton(Object.assign(oCellSettings, {
                    height: sButtonHeight
                }));

                oRowTemplate.removeCell(aCells[iCellIndex]);
                oRowTemplate.insertCell(oNewButton, iCellIndex);
            }

            // modifying the template in-place does nothing until rebound
            oTable.bindItems(oBindingInfo);
        }
    })
});
