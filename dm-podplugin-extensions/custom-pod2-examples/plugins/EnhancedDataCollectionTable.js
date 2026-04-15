sap.ui.define([
    "sap/m/library",
    "sap/ui/core/library",
    "sap/dm/dme/pod2/datacollection/widget/DataCollectionGroupTableWidget",
    "sap/dm/dme/pod2/api/ApiClient",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/datacollection/context/DataCollectionModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/datacollection/context/data/DataCollectionDelegate",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/base/security/encodeXML"
], (
    MobileLibrary,
    SapUiCoreLibrary,
    DataCollectionGroupTableWidget,
    ApiClient,
    ModelPath,
    DataCollectionModelPath,
    PodContext,
    DataCollectionDelegate,
    I18nResourceModel,
    encodeXML
) => {
    "use strict";

    const { Priority, ValueState } = SapUiCoreLibrary;
    const { ObjectStatus, Button, Text } = MobileLibrary;

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

        static getCategory() {
            return "Sample Custom Extensions";
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
                PodContext.subscribe(DataCollectionModelPath.DataCollectionGroups, this._fetchData, this);
                PodContext.subscribe(ModelPath.SelectedWorkListItems, this._fetchData, this);
            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(DataCollectionModelPath.DataCollectionGroups, this._fetchData, this);
                PodContext.unsubscribe(ModelPath.SelectedWorkListItems, this._fetchData, this);
            }
        }

        async _fetchData() {
            try {
                await ApiClient.ready();
                if (!ApiClient.internal.datacollection) {
                    PodContext.set("/collectedParameters", this._getMockCollectedParameters());
                    return;
                }
                const aCollections = await DataCollectionDelegate.refreshLoggedData();
                const mCache = {};

                aCollections?.forEach(oCollection => {
                    if (!mCache[oCollection.sfc]) {
                        mCache[oCollection.sfc] = [];
                    }
                    mCache[oCollection.sfc].push(...oCollection.parameters);
                });

                PodContext.set("/collectedParameters", mCache);
            } catch (oError) {
                console.error("Failed to fetch collected parameters:", oError);
                PodContext.set("/collectedParameters", {});
            }
        }

        _getMockCollectedParameters() {
            const oWorkListItem = PodContext.getLastSelectedWorkListItem();
            const sSfc = oWorkListItem?.sfc ?? "SFC-MOCK";
            const aGroups = PodContext.getModel().getProperty(DataCollectionModelPath.DataCollectionGroups) ?? [];
            const sDate = new Date().toISOString();

            const aMockParams = aGroups
                .filter(oGroup => oGroup.measuredCount > 0)
                .flatMap(oGroup => [
                    {
                        measureGroup: oGroup.group,
                        measureName: "Temperature",
                        actual: (20 + Math.random() * 10).toFixed(1),
                        unitOfMeasure: "°C",
                        dateCreated: sDate
                    },
                    {
                        measureGroup: oGroup.group,
                        measureName: "Pressure",
                        actual: (100 + Math.random() * 20).toFixed(1),
                        unitOfMeasure: "bar",
                        dateCreated: sDate
                    }
                ]);

            return { [sSfc]: aMockParams };
        }

        _createCell(columnConfig) {
            if (columnConfig.field === this.constructor.Field.LastCollectedValue) {
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

            const allowedFields = [
                DataCollectionGroupTableWidget.Field.DataCollectionGroupVersion,
                DataCollectionGroupTableWidget.Field.Description,
                DataCollectionGroupTableWidget.Field.ProgressIndicator,
                DataCollectionGroupTableWidget.Field.CollectButton,
                DataCollectionGroupTableWidget.Field.PostingsButton
            ];

            return allowedFields.includes(columnConfig.field)
                ? super._createCell(columnConfig)
                : new Text({ text: "" });
        }

        _formatValue(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return "";

            return aParams.map(oParam => {
                const sName = encodeXML(oParam.measureName || "");
                const sValue = encodeXML(String(oParam.actual ?? ""));
                const sUom = oParam.unitOfMeasure || "";
                return sUom ? `${sName}: ${sValue} ${sUom}` : `${sName}: ${sValue}`;
            }).join(", ");
        }

        _getState(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return ValueState.None;
            if (oDcGroup.allDataCollected) return ValueState.Success;
            return oDcGroup.measuredCount > 0 ? ValueState.Information : ValueState.None;
        }

        _getIcon(oDcGroup, mCache) {
            const aParams = this._getLastCollectionParams(oDcGroup, mCache);
            if (!aParams?.length) return "";
            if (oDcGroup.allDataCollected) return "sap-icon://accept";
            return oDcGroup.measuredCount > 0 ? "sap-icon://history" : "";
        }

        _getLastCollectionParams(oDcGroup, mCache) {
            if (!oDcGroup || !mCache) return null;

            const oWorkListItem = PodContext.getLastSelectedWorkListItem();
            if (!oWorkListItem) return null;

            const aParams = mCache[oWorkListItem.sfc]?.filter(p => p.measureGroup === oDcGroup.group);
            if (!aParams?.length) return null;

            const sLatestDate = aParams.reduce((latest, p) => {
                const current = new Date(p.dateCreated);
                return !latest || current > new Date(latest) ? p.dateCreated : latest;
            }, null);

            return aParams.filter(p => p.dateCreated === sLatestDate);
        }

        _createToolbarContent() {
            const aControls = super._createToolbarContent();

            aControls.push(new Button({
                icon: "sap-icon://refresh",
                tooltip: this.getI18nText("EnhancedDataCollection.refreshTooltip"),
                press: () => this._fetchData()
            }));

            return aControls;
        }
    }

    return EnhancedDataCollectionTable;
});