sap.ui.define([
    "sap/ui/base/Object",
    "sap/example/plugins/downtimeExtensionProvider/control/DowntimeListButton"
], function (BaseObject, DowntimeListButton) {
    "use strict";

    /**
     * Get the object needed to instantiate a control with the same settings as oControl.
     *
     * Can be used to apply the properties of one control to a new instance of a
     * different control (such as making a custom DowntimeListButton with the same
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

    return BaseObject.extend("sap.example.plugins.downtimeExtensionProvider.ExtensionUtilities", {
        constructor: function () {
            this.bLogToConsole = false;
        },

        /**
         * Replace any sap.m.Button cells with our custom DowntimeListButton
         * while keeping the same properties, bindings, and event listeners
         */
        replaceDowntimeListButtons: function (oTable, sButtonHeight, oController) {
            let oBindingInfo = oTable.getBindingInfo("items");
            let oRowTemplate = oBindingInfo.template;
            let aCells = oRowTemplate.getCells();
            let aButtonCellIndices = [];
            let aLayoutCellIndices = [];

            // find all cells with buttons
            for (let i = 0; i < aCells.length; i++) {
                if (aCells[i].getMetadata().getElementName() === "sap.m.Button") {
                    aButtonCellIndices.push(i);
                }
            }

            // find all cells with buttons
            for (let i = 0; i < aCells.length; i++) {
                if (aCells[i].getMetadata().getElementName() === "sap.ui.layout.HorizontalLayout") {
                    aLayoutCellIndices.push(i);
                }
            }

            // for each button, replace it with a custom DowntimeListButton
            for (let i = 0; i < aButtonCellIndices.length; i++) {
                let iCellIndex = aButtonCellIndices[i];
                let oCellSettings = getSettingsForControl(aCells[iCellIndex], oController);

                let oNewButton = new DowntimeListButton(Object.assign(oCellSettings, {
                    height: sButtonHeight
                }));

                oRowTemplate.removeCell(aCells[iCellIndex]);
                oRowTemplate.insertCell(oNewButton, iCellIndex);
            }

            // for each layout, replace it with a custom DowntimeListButton
            for (let i = 0; i < aLayoutCellIndices.length; i++) {
                let iCellIndex = aLayoutCellIndices[i];
                let oCellSettings = getSettingsForControl(aCells[iCellIndex].getContent()[0], oController);

                let oNewButton = new DowntimeListButton(Object.assign(oCellSettings, {
                    height: sButtonHeight
                }));

                oRowTemplate.removeCell(aCells[iCellIndex]);
                var oHorizontalLayout = new sap.ui.layout.HorizontalLayout();
                oHorizontalLayout.setAllowWrapping(true);
                oHorizontalLayout.addContent(oNewButton);
                oHorizontalLayout.addContent(aCells[iCellIndex].getContent()[1])
                oRowTemplate.insertCell(oHorizontalLayout, iCellIndex);
            }

            // modifying the template in-place does nothing until rebound
            oTable.bindItems(oBindingInfo);
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
