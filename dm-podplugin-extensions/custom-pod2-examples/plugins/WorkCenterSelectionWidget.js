sap.ui.define([
    "sap/m/library",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/CssSizePropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/api/workcenter/WorkCenterPublicApiClient",
    "sap/ui/core/ListItem"
], (
    MobileLibrary,
    Widget,
    PodContext,
    ModelPath,
    WidgetProperty,
    StringPropertyEditor,
    CssSizePropertyEditor,
    PropertyCategory,
    I18nResourceModel,
    WorkCenterPublicApiClient,
    ListItem
) => {
    "use strict";

    const { VBox, Select, Label } = MobileLibrary;

    const CONTEXT_PATH_SELECTION = "/custom/workcenterSelection";

    class WorkCenterSelectionWidget extends Widget {

        static PropertyId = Object.freeze({
            CustomFieldKey: "customFieldKey",
            Label:          "label",
            Width:          "width",
            Height:         "height"
        });

        static #oI18nModel = new I18nResourceModel({
            bundleName: "custom.pod2.example.plugins.i18n.i18n"
        });

        static getI18nModel() { return this.#oI18nModel; }

        /** @extensible @override */
        static getIcon() { return "sap-icon://value-help"; }

        /** @extensible @override */
        static getCategory() { return "Sample Custom Extensions"; }

        /** @extensible @override */
        static getDefaultConfig(sId) {
            return {
                properties: {
                    [WorkCenterSelectionWidget.PropertyId.CustomFieldKey]: "",
                    [WorkCenterSelectionWidget.PropertyId.Label]: "Selection",
                    [WorkCenterSelectionWidget.PropertyId.Width]: "100%",
                    [WorkCenterSelectionWidget.PropertyId.Height]: "auto"
                }
            };
        }

        #oClient = new WorkCenterPublicApiClient();
        #oSelect = null;

        /**
         * @extensible
         * @override
         * @param {sap.dm.dme.pod2.widget.WidgetConfig} oConfig
         */
        constructor(oConfig) {
            super(oConfig);
        }

        /**
         * @extensible
         * @override
         */
        onInit() {
            super.onInit();
            if (!PodContext.isRunMode()) { return; }
            PodContext.subscribe(ModelPath.FilterWorkCenters, this._onWorkCenterFilterChanged, this);
            this._loadSelectItems();
        }

        /**
         * @extensible
         * @override
         */
        onExit() {
            super.onExit();
            if (!PodContext.isRunMode()) { return; }
            PodContext.unsubscribe(ModelPath.FilterWorkCenters, this._onWorkCenterFilterChanged, this);
        }

        /**
         * @extensible
         * @override
         * @returns {sap.ui.core.Element}
         */
        _createView() {
            const sLabel  = this.getPropertyValue(WorkCenterSelectionWidget.PropertyId.Label)  ?? "Selection";
            const sWidth  = this.getPropertyValue(WorkCenterSelectionWidget.PropertyId.Width)  ?? "100%";
            const sHeight = this.getPropertyValue(WorkCenterSelectionWidget.PropertyId.Height) ?? "auto";

            this.#oSelect = new Select({
                width: "100%",
                change: (oEvent) => this._onSelectionChange(oEvent)
            });

            return new VBox(this.getConfig().id, {
                items: [
                    new Label({ text: sLabel, labelFor: this.#oSelect }),
                    this.#oSelect
                ],
                width: sWidth,
                height: sHeight
            });
        }

        /**
         * @extensible
         * @override
         * @returns {sap.dm.dme.pod2.widget.metadata.WidgetProperty[]}
         */
        getProperties() {
            return [
                new WidgetProperty({
                    displayName: this.getI18nText("WorkCenterSelection.prop.customFieldKey"),
                    description: this.getI18nText("WorkCenterSelection.prop.customFieldKeyDesc"),
                    category: PropertyCategory.Data,
                    propertyEditor: new StringPropertyEditor(this, WorkCenterSelectionWidget.PropertyId.CustomFieldKey)
                }),
                new WidgetProperty({
                    displayName: this.getI18nText("WorkCenterSelection.prop.label"),
                    category: PropertyCategory.Appearance,
                    propertyEditor: new StringPropertyEditor(this, WorkCenterSelectionWidget.PropertyId.Label)
                }),
                new WidgetProperty({
                    displayName: this.getI18nText("WorkCenterSelection.prop.width"),
                    category: PropertyCategory.Dimension,
                    propertyEditor: new CssSizePropertyEditor(this, WorkCenterSelectionWidget.PropertyId.Width)
                }),
                new WidgetProperty({
                    displayName: this.getI18nText("WorkCenterSelection.prop.height"),
                    category: PropertyCategory.Dimension,
                    propertyEditor: new CssSizePropertyEditor(this, WorkCenterSelectionWidget.PropertyId.Height)
                })
            ];
        }

        _onWorkCenterFilterChanged() {
            this._loadSelectItems();
        }

        async _loadSelectItems() {
            if (!this.#oSelect) { return; }

            const sCustomFieldKey = this.getPropertyValue(WorkCenterSelectionWidget.PropertyId.CustomFieldKey);
            if (!sCustomFieldKey) {
                this.#oSelect.destroyItems();
                return;
            }

            const sPlant = PodContext.getPlant();
            const aFilterWorkCenters = PodContext.getFilterWorkCenters() ?? [];
            const sWorkCenter = aFilterWorkCenters[0]?.workCenter;

            if (!sPlant || !sWorkCenter) {
                this.#oSelect.destroyItems();
                return;
            }

            const aWorkCenters = await this.#fetchWorkCenter(sPlant, sWorkCenter);
            const aRawValues = this.#extractCustomFieldValues(aWorkCenters, sCustomFieldKey);
            this.#populateSelect(aRawValues);
        }

        async #fetchWorkCenter(sPlant, sWorkCenter) {
            try {
                return await this.#oClient.getWorkCenters({ plant: sPlant, workCenter: sWorkCenter });
            } catch (oError) {
                return [];
            }
        }

        #extractCustomFieldValues(aWorkCenters, sKey) {
            if (!aWorkCenters?.length) { return []; }

            const aCustomValues = aWorkCenters[0]?.customValues ?? [];
            const oMatch = aCustomValues.find((oEntry) => oEntry.attribute === sKey);
            if (!oMatch?.value) { return []; }

            return oMatch.value.split(",").map((sVal) => sVal.trim()).filter(Boolean);
        }

        #populateSelect(aValues) {
            this.#oSelect.destroyItems();
            aValues.forEach((sValue) => {
                this.#oSelect.addItem(new ListItem({ key: sValue, text: sValue }));
            });
        }

        _onSelectionChange(oEvent) {
            const sSelectedKey = oEvent.getParameter("selectedItem")?.getKey() ?? "";
            PodContext.set(CONTEXT_PATH_SELECTION, sSelectedKey);
        }
    }

    return WorkCenterSelectionWidget;
});
