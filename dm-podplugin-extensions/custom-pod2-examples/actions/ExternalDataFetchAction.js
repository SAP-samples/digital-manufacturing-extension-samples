sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/api/RestClient"
],
/**
 * @param {typeof sap.dm.dme.pod2.action.Action} Action
 * @param {typeof sap.dm.dme.pod2.action.metadata.ActionProperty} ActionProperty
 * @param {typeof sap.dm.dme.pod2.context.PodContext} PodContext
 * @param {typeof sap.dm.dme.pod2.propertyeditor.StringPropertyEditor} StringPropertyEditor
 */
(
    Action,
    ActionProperty,
    PodContext,
    StringPropertyEditor,
    RestClient
) => {
    "use strict";

    const PropertyId = Object.freeze({
        DataURL: "dataURL",
        InputPayload: "inputPayload",
        OutputRESTData: "outputRESTData"
    });

    /**
     * A simple example action that logs a message to the console. The message can contain bind expressions that
     * references properties in PodContext.
     *
     * @alias sap.sample.extensions.basic.action.ConsoleLogAction
     * @extends sap.dm.dme.pod2.action.Action
     */
    class ExternalDataFetchAction extends Action {
        /**
         * The message to log to the console. The message can contain bind expressions like {/selectedWorkListItem/sfc}.
         *
         * @type {string}
         */
        #sDataUrl = null;
        #inputPayload = null;
        #outputRESTData = null;

        /**
         * Gets the display name to show in the action palette of the POD Designer.
         *
         * @override
         * @returns {string}
         */
        static getDisplayName() {
            return "Fetch REST Data";
        }

        /**
         * Gets a description of the action. The description is shown in the action list of the POD Designer when
         * creating a new action.
         *
         * @override
         * @returns {string}
         */
        static getDescription() {
            return "Data from REST API";
        }

        /**
         * Creates a new instance of the ConsoleLogAction class.
         *
         * @override
         * @param {sap.dm.dme.pod2.action.Action.ActionConfig} oConfig The action configuration.
         */
        constructor(oConfig) {
            super(oConfig);

            this.#sDataUrl = this.getPropertyValue(PropertyId.DataURL);
            this.#inputPayload = this.getPropertyValue(PropertyId.InputPayload);
            this.#outputRESTData = this.getPropertyValue(PropertyId.OutputRESTData);
        }

        /**
         * Executes the action.
         *
         * @override
         * @param {sap.dm.dme.pod2.action.ActionContext} oActionContext Contains the context for the action including
         * the widget it was triggered from and the SAPUI5 event object.
         * @returns {void|Promise<void>}
         */
        async execute(oActionContext) {
            if (this.#sDataUrl && this.#outputRESTData) {
                let response = await RestClient.post(this.#sDataUrl, this.#inputPayload);

                if(response.output_context){
                    PodContext.set("/" + this.#outputRESTData , JSON.parse(response.output_context))
                }
                else{
                    PodContext.set("/" + this.#outputRESTData , response);  
                }

            }
        }

        /**
         * Gets the configurable properties of the action.
         *
         * @override
         * @returns {Array<sap.dm.dme.pod2.action.metadata.ActionProperty>} An array of ActionProperty objects or null
         * if the action has no configurable properties.
         */
        getProperties() {
            return [
                new ActionProperty({
                    displayName: "Data URL",
                    description: "External URL to be called",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.DataURL)
                }),
                new ActionProperty({
                    displayName: "Input Payload",
                    description: "External URL to be called",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.InputPayload)
                }),
                new ActionProperty({
                    displayName: "Output Data Context",
                    description: "POD Context to be set",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.OutputRESTData)
                })
            ];
        }
    }

    return ExternalDataFetchAction;
});