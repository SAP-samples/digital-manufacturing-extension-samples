sap.ui.define([
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/ObjectStatus",
    "sap/ui/core/library",
    "sap/dm/dme/pod2/widget/datacollection/DataCollectionGroupTableWidget",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/data/DataCollectionDelegate",
    "sap/dm/dme/pod2/model/I18nResourceModel"
], (
    Button,
    Text,
    ObjectStatus,
    SapUiCoreLibrary,
    DataCollectionGroupTableWidget,
    ModelPath,
    PodContext,
    DataCollectionDelegate,
    I18nResourceModel
) => {
    "use strict";

    const { Priority, ValueState } = SapUiCoreLibrary;

    /**
     * Enhanced Data Collection Group Table Widget
     * Adds "Last Collected Value" column showing most recent collected parameter
     */
    class EnhancedDataCollectionTable extends DataCollectionGroupTableWidget {

        static #oI18nModel = new I18nResourceModel("custom/pod2/example/plugins/i18n/i18n");

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static Field = Object.freeze({
            ...DataCollectionGroupTableWidget.Field,
            LastCollectedValue: "lastCollectedValue"
        });

        static getDisplayName() {
            return "Enhanced Data Collection Table";
        }

        static getDescription() {
            return "Data Collection Groups table with last collected values";
        }

        static getFields() {
            const thisI18n = this.getI18nText.bind(this);
            return [
                ...super.getFields(),
                {
                    field: this.Field.LastCollectedValue,
                    importance: Priority.High,
                    text: thisI18n("EnhancedDataCollection.lastCollectedValue"),
                    width: "20%"
                }
            ];
        }

        onInit() {
            super.onInit();
            if (PodContext.isRunMode()) {
                PodContext.subscribe(ModelPath.DataCollectionGroups, this._fetchData, this);
                PodContext.subscribe(ModelPath.SelectedWorkListItems, this._fetchData, this);
            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(ModelPath.DataCollectionGroups, this._fetchData, this);
                PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._fetchData, this);
            }
        }

        async _fetchData() {
            try {
                const aCollections = await DataCollectionDelegate.refreshLoggedData();

                const mCache = {};
                aCollections?.forEach(oCollection => {
                    if (!mCache[oCollection.sfc]) {
                        mCache[oCollection.sfc] = [];
                    }
                    mCache[oCollection.sfc].push(...oCollection.parameters);
                });

                // Store in PodContext for reactive updates
                PodContext.set("/collectedParameters", mCache);
            } catch (oError) {
                console.error("Failed to fetch collected parameters:", oError);
                PodContext.set("/collectedParameters", {});
            }
        }

        _createCell(columnConfig) {
            if (columnConfig.field === EnhancedDataCollectionTable.Field.LastCollectedValue) {
                return new ObjectStatus({
                    text: {
                        parts: [{ path: "" }, { path: "/collectedParameters" }],
                        formatter: this._formatValue.bind(this)
                    },
                    state: {
                        parts: [{ path: "" }, { path: "/collectedParameters" }],
                        formatter: this._getState.bind(this)
                    },
                    icon: {
                        parts: [{ path: "" }, { path: "/collectedParameters" }],
                        formatter: this._getIcon.bind(this)
                    }
                });
            }

            switch (columnConfig.field) {
                case DataCollectionGroupTableWidget.Field.DataCollectionGroupVersion:
                case DataCollectionGroupTableWidget.Field.Description:
                case DataCollectionGroupTableWidget.Field.ProgressIndicator:
                case DataCollectionGroupTableWidget.Field.CollectButton:
                case DataCollectionGroupTableWidget.Field.PostingsButton:
                    return super._createCell(columnConfig);
                default:
                    return new Text({ text: "" });
            }
        }

        _formatValue(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return this.getI18nText("EnhancedDataCollection.noDataCollected");

            return aParams.map(oParam => {
                const sName = oParam.measureName || "";
                const sValue = oParam.actual ?? "";
                const sUom = oParam.unitOfMeasure || "";
                return sUom ? `${sName}: ${sValue} ${sUom}` : `${sName}: ${sValue}`;
            }).join(", ");
        }

        _getState(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return ValueState.None;
            if (oDcGroup.allDataCollected) return ValueState.Success;
            if (oDcGroup.measuredCount > 0) return ValueState.Information;
            return ValueState.None;
        }

        _getIcon(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return "";
            if (oDcGroup.allDataCollected) return "sap-icon://accept";
            if (oDcGroup.measuredCount > 0) return "sap-icon://history";
            return "";
        }

        _getLastCollectionParams(oDcGroup, mCache) {
            if (!oDcGroup || !mCache) return null;

            const oWorkListItem = PodContext.getLastSelectedWorkListItem();
            if (!oWorkListItem) return null;

            const sSfc = oWorkListItem.sfc;
            const aParams = mCache[sSfc]?.filter(p => p.measureGroup === oDcGroup.group);

            if (!aParams?.length) return null;

            // Get the most recent collection timestamp
            const sLatestDate = aParams.reduce((latest, p) => {
                const current = new Date(p.dateCreated);
                return !latest || current > new Date(latest) ? p.dateCreated : latest;
            }, null);

            // Return all parameters from the most recent collection
            return aParams.filter(p => p.dateCreated === sLatestDate);
        }

        _createToolbarContent() {
            const aControls = super._createToolbarContent();

            // Add refresh button at the end
            const oRefreshButton = new Button({
                icon: "sap-icon://refresh",
                tooltip: this.getI18nText("EnhancedDataCollection.refreshTooltip"),
                press: () => this._fetchData()
            });

            aControls.push(oRefreshButton);
            return aControls;
        }
    }

    return EnhancedDataCollectionTable;
});