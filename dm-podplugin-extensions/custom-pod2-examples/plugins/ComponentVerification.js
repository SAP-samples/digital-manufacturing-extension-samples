sap.ui.define([
    "sap/m/library",
    "sap/dm/dme/pod2/sfccomponents/consumption/widget/ComponentConsumptionListWidget",
    "sap/dm/dme/pod2/widget/metadata/WidgetEvent",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/sfccomponents/consumption/context/ConsumptionContext",
    "sap/dm/dme/pod2/model/I18nResourceModel"
], (
    MobileLibrary,
    ComponentConsumptionListWidget,
    WidgetEvent,
    WidgetProperty,
    StringPropertyEditor,
    PropertyCategory,
    ConsumptionContext,
    I18nResourceModel
) => {
    "use strict";

    const { Button, ButtonType } = MobileLibrary;

    class ComponentVerification extends ComponentConsumptionListWidget {

        static EventId = Object.freeze({
            Validate: "validate"
        });

        static Field = Object.freeze({
            verifyButton: "verifyButton"
        });

        static PropertyId = Object.freeze({
            VerifyPluginId: "verifyPluginId"
        });

        static #oI18nModel = new I18nResourceModel({
            bundleName: "custom.pod2.example.plugins.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "Component Verification";
        }

        static getDescription() {
            return "Verify components during assembly operations";
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        static getDefaultConfig() {
            const oConfig = super.getDefaultConfig();

            if (oConfig.properties?.columns) {
                oConfig.properties.columns = oConfig.properties.columns.filter(
                    col => col.id !== "ComponentConsumeColumn"
                );
                oConfig.properties.columns.push({
                    id: "ComponentVerifyColumn",
                    text: "Verification",
                    field: this.Field.verifyButton,
                    width: "15%"
                });
            }

            return oConfig;
        }

        _createCell(columnConfig) {
            if (columnConfig.field === this.constructor.Field.verifyButton) {
                return new Button({
                    text: "Verify",
                    type: ButtonType.Emphasized,
                    press: this._onVerifyButtonPress.bind(this)
                });
            }
            return super._createCell(columnConfig);
        }

        /**
         * Handles verify button press event
         * @param {sap.ui.base.Event} oEvent - Button press event
         * @private
         */
        _onVerifyButtonPress(oEvent) {
            try {
                const oContext = oEvent?.getSource()?.getBindingContext();
                if (!oContext) {
                    throw new Error(this.getI18nText("ComponentVerification.noComponentData"));
                }

                const oItem = oContext.getObject();
                if (!oItem?.material && !oItem?.component) {
                    throw new Error(this.getI18nText("ComponentVerification.componentInfoMissing"));
                }

                const iIndex = this._extractIndex(oContext.getPath());
                ConsumptionContext.setConsumptionListSelectedItems([oItem]);
                ConsumptionContext.setConsumptionListSelectedItemIndex(iIndex);

                const sDialogId = this.getPropertyValue(this.constructor.PropertyId.VerifyPluginId)?.trim();
                if (!sDialogId) {
                    throw new Error(this.getI18nText("ComponentVerification.verifyPluginNotConfigured"));
                }

                this.getPodRuntime().showDialog(sDialogId);
            } catch (oError) {
                throw new Error(oError.message || this.getI18nText("ComponentVerification.verificationFailed"));
            }
        }

        _extractIndex(sPath) {
            if (!sPath) return 0;
            if (!isNaN(sPath)) return +sPath;
            const match = sPath.match(/\d+/);
            return match ? +match[0] : 0;
        }

        _createToolbarContent() {
            const aControls = super._createToolbarContent() ?? [];

            aControls.push(new Button({
                text: this.getI18nText("ComponentVerification.validateButton"),
                type: ButtonType.Default,
                press: (oEvent) => this._handleEvent(this.constructor.EventId.Validate, oEvent)
            }));

            return aControls;
        }

        onInit() {
            super.onInit();
            // Ensure the validate button is present even if the parent rebuilt the toolbar asynchronously
            const oToolbar = this.getTable?.()?.getHeaderToolbar?.();
            if (oToolbar && !oToolbar.getContent().some(c => c.getId?.()?.endsWith("-validate-btn"))) {
                oToolbar.addContent(new Button(`${this.getId()}-validate-btn`, {
                    text: this.getI18nText("ComponentVerification.validateButton"),
                    type: ButtonType.Default,
                    press: (oEvent) => this._handleEvent(this.constructor.EventId.Validate, oEvent)
                }));
            }
        }

        getEvents() {
            return [
                new WidgetEvent({
                    id: this.constructor.EventId.Validate,
                    displayName: this.getI18nText("ComponentVerification.validateButton")
                }),
                ...super.getEvents() ?? []
            ];
        }

        getProperties() {
            return [
                ...super.getProperties(),
                new WidgetProperty({
                    displayName: "Verify Plugin ID",
                    description: "Plugin ID for verification dialog",
                    category: PropertyCategory.Main,
                    propertyEditor: new StringPropertyEditor(
                        this,
                        this.constructor.PropertyId.VerifyPluginId
                    )
                })
            ].sort((a, b) => a.getDisplayName().localeCompare(b.getDisplayName()));
        }
    }

    return ComponentVerification;
});