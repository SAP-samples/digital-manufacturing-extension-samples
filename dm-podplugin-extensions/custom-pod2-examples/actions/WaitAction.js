sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/propertyeditor/IntegerPropertyEditor"
], (
    Action,
    ActionProperty,
    IntegerPropertyEditor
) => {
    "use strict";

    const PropertyId = Object.freeze({
        Duration: "duration"
    });

    /**
     * An Action that waits for something to occur before continuing.
     *
     * @alias custom.pod2.example.actions.WaitAction
     * @extends sap.dm.dme.pod2.action.Action
     */
    class WaitAction extends Action {

        static getDisplayName() {
            return "Wait";
        }

        static getDescription() {
            return "Waits for a specified duration before running the next action";
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        async execute(oActionContext) {
            const iMilliseconds = this.getPropertyValue(PropertyId.Duration);

            // For demonstration purposes this only waits a specified amount of time, but any Promise can be returned
            // to ensure the next action in the sequence only runs once the desired prerequisites are met.
            return new Promise((fnResolve) => {
                setTimeout(fnResolve, iMilliseconds);
            });
        }

        getProperties() {
            return [
                new ActionProperty({
                    id: PropertyId.Duration,
                    displayName: "Duration (milliseconds)",
                    description: "The number of milliseconds to wait.",
                    propertyEditor: new IntegerPropertyEditor(this, PropertyId.Duration)
                })
            ];
        }

        getPropertyValue(sProperty) {
            if (sProperty === PropertyId.Duration) {
                // Coalesce a default value if none is configured.
                return super.getPropertyValue(sProperty) ?? 1000;
            }
        }
    }

    return WaitAction;
});
