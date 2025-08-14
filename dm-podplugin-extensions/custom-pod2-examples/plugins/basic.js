sap.ui.define([
    "sap/m/library",
    "sap/ui/core/library",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/ColorPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/IconPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/MenuPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/ResourcePropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/SortingPropertyEditor"
], (
    SapMLibrary,
    SapUiCoreLibrary,
    I18nResourceModel,
    MessageBox,
    JSONModel,
    Widget,
    WidgetProperty,
    BooleanPropertyEditor,
    StringPropertyEditor,
    SelectPropertyEditor,
    ColorPropertyEditor,
    IconPropertyEditor,
    MenuPropertyEditor,
    ResourcePropertyEditor,
    SortingPropertyEditor
) => {


    "use strict";

    class basic extends Widget {


        static getDisplayName() {
            return "Example POD 2.0 Plugin";
        }

        static getIcon() {
            return "sap-icon://locate-me-2";
        }

        static getCategory() {
            return "Custom Examples"
        }

        static getDescription() {
            return "Example POD 2.0 Plugin"
        }

        _createView() {
            const oConfig = this.getConfig();

            console.log("Creating UI5 Test Widget View");
            // Create Text Field
            const oTextField = new sap.m.Input({
                value: "Sample Input Value",
                editable: false
            });

            // Create Button
            const oButton = new sap.m.Button({
                text: "Sample Button Text",
                press: () => {
                    sap.m.MessageToast.show("Button was pressed!");
                }
            });

            // Optional: Create a simple container to hold them
            const oVBox = new sap.m.VBox(oConfig.id, {
                items: [oTextField, oButton],
                alignItems: "Start",
                width: "100%"
            });

            return oVBox;
        }

        getProperties() {

            const aProperties = [];
            aProperties.push(
                new WidgetProperty({
                    displayName: "Property 1",
                    description: "Description 1",
                    category: "Custom Properties",
                    propertyEditor: new BooleanPropertyEditor(this,
                        "SampleBoolean", true)
                }),
                new WidgetProperty({
                    displayName: "Property 2",
                    description: "Description 2",
                    category: "Custom Properties",
                    propertyEditor: new BooleanPropertyEditor(this,
                        "SampleBoolean", true)
                }),
                
            );

            return aProperties;
        }



    }


    return basic;
});