sap.ui.define([
    "sap/m/library",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/sfccomponents/consumption/widget/ComponentConsumptionListWidget",
    "sap/dm/dme/pod2/widget/metadata/WidgetCategory",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/sfccomponents/consumption/context/ConsumptionContext"
], (
    MobileLibrary,
    ModelPath,
    PodContext,
    ComponentConsumptionListWidget,
    WidgetCategory,
    WidgetProperty,
    StringPropertyEditor,
    I18nResourceModel,
    PropertyCategory,
    ConsumptionContext
) => {
    "use strict";

    const {
        Button,
        ButtonType,
    } = MobileLibrary;


    class ComponentVerificationWidget extends ComponentConsumptionListWidget {


        static Field = Object.freeze({
            sequence: "sequence",
            component: "component",
            version: "version",
            plannedBatch: "plannedBatch",
            postedQuantity: "postedQuantity",
            verifyButton: "verifyButton"
        });

        static PropertyId = Object.freeze({
            VerifyPluginId: "verifyPluginId"
        });


        static #oI18nModel = new I18nResourceModel({
            bundleName: "sap.dm.dme.pod2.sfccomponents.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }


        static getDisplayName() {
            return "Component Verification";
        }

        static getDescription() {
            return this.getDisplayName();
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        static getHelpUrl() {
            return "";
        }

        async onInit() {
            super.onInit();

        }

        onExit() {
            super.onExit();
        }

        static getDefaultConfig() {
            let oParentConfig = super.getDefaultConfig();

            oParentConfig.properties.columns.pop();

            oParentConfig.properties.columns.push({
                id: "ComponentVerifyColumn",
                text: "Verification",
                field: ComponentVerificationWidget.Field.verifyButton,
                width: "15%"
            });

            return oParentConfig;

        }


        _createCell(columnConfig) {
            if (columnConfig.field === ComponentVerificationWidget.Field.verifyButton) {

                return new Button({
                    text: "Verify",
                    type: ButtonType.Emphasized,
                    press: this._onVerifyButtonPress.bind(this)
                });
            } else {
                return super._createCell(columnConfig);
            }
        }

        _onVerifyButtonPress(oEvent) {
            const oSelectedItem = oEvent.getSource().getBindingContext().getObject();
            const rowPath = oEvent.getSource().getBindingContext().getPath();
            const iResultIndex = isNaN(rowPath) ? +rowPath.match(/\d+/)[0] : rowPath;
            ConsumptionContext.setConsumptionListSelectedItems([oSelectedItem]);
            ConsumptionContext.setConsumptionListSelectedItemIndex(iResultIndex);
            const sDialogId = this.getPropertyValue(ComponentVerificationWidget.PropertyId.VerifyPluginId);
            this.getPodRuntime().showDialog(sDialogId);
        }

        getProperties() {
            const aProperties = [
                ...super.getProperties(),
                new WidgetProperty({
                    displayName: "Verify Plugin Id",
                    description: "Plugin Id to be used for Verify Button",
                    category: PropertyCategory.Main,
                    propertyEditor: new StringPropertyEditor(
                        this,
                        ComponentVerificationWidget.PropertyId.VerifyPluginId
                    )
                })
            ];
            return aProperties.sort((a, b) => a.getDisplayName().localeCompare(b.getDisplayName()));
        }

    }

    return ComponentVerificationWidget;
});