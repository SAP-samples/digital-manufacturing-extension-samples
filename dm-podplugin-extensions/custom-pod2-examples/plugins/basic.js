sap.ui.define([
    "sap/m/library",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/base/Log"
], (
    MobileLibrary,
    Widget,
    WidgetProperty,
    BooleanPropertyEditor,
    PropertyCategory,
    I18nResourceModel,
    Log
) => {
    "use strict";

    const { VBox, Input, Button, MessageToast, Text } = MobileLibrary;

    /**
     * Basic POD 2.0 Plugin Example
     * Demonstrates minimal plugin implementation with simple UI controls
     */
    class BasicPlugin extends Widget {

        static PropertyId = Object.freeze({
            EnableFeature: "enableFeature"
        });

        static #oI18nModel = new I18nResourceModel({
            bundleName: "custom.pod2.example.plugins.i18n.i18n"
        });

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "Example POD 2.0 Plugin";
        }

        static getIcon() {
            return "sap-icon://locate-me-2";
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        static getDescription() {
            return "Minimal POD 2.0 plugin demonstrating basic functionality";
        }

        /**
         * Creates the plugin view
         * @returns {sap.m.VBox} The plugin view
         * @private
         */
        _createView() {
            const oConfig = this.getConfig();

            // Validate configuration
            if (!oConfig || !oConfig.id) {
                Log.error("[BasicPlugin] Invalid configuration");
                return new VBox({
                    items: [
                        new Text({
                            text: this.getI18nText("BasicPlugin.configError") || "Plugin configuration error"
                        })
                    ]
                });
            }

            const oInput = new Input({
                value: this.getI18nText("BasicPlugin.sampleInputValue") || "Sample Input Value",
                editable: false,
                width: "100%"
            });

            const oButton = new Button({
                text: this.getI18nText("BasicPlugin.sampleButton") || "Sample Button",
                press: () => {
                    MessageToast.show(this.getI18nText("BasicPlugin.buttonPressed") || "Button was pressed!");
                }
            });

            const oView = new VBox(oConfig.id, {
                items: [oInput, oButton],
                alignItems: "Start",
                width: "100%"
            });

            oView.addStyleClass("sapUiSmallMargin");
            return oView;
        }

        getProperties() {
            return [
                new WidgetProperty({
                    displayName: "Enable Feature",
                    description: "Enable or disable the sample feature",
                    category: PropertyCategory.Main,
                    propertyEditor: new BooleanPropertyEditor(
                        this,
                        this.constructor.PropertyId.EnableFeature,
                        true
                    )
                })
            ];
        }
    }

    return BasicPlugin;
});
