sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/context/MessageHistory",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/notification/EventType",
    "sap/dm/dme/pod2/notification/Filter",
    "sap/dm/dme/pod2/notification/PodNotificationWebSocket"
], (
    Action,
    ActionProperty,
    MessageHistory,
    PodContext,
    StringPropertyEditor,
    EventType,
    Filter,
    PodNotificationWebSocket
) => {
    "use strict";

    const PropertyId = Object.freeze({
        ContextPath: "contextPath"
    });

    /**
     * An Action that subscribes to the CUSTOM (generic) POD Notification WebSocket event and
     * stores the received payload in the POD Context model under a configurable path.
     *
     * @alias custom.pod2.example.actions.ServerNotificationHandlerAction
     * @extends sap.dm.dme.pod2.action.Action
     */
    class ServerNotificationHandlerAction extends Action {

        static getDisplayName() {
            return "Server Notification Handler";
        }

        static getDescription() {
            return "Subscribes to the CUSTOM server-push notification and stores the payload in the POD Context";
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        async execute(oActionContext) {
            if (PodContext.isRunMode()) {
                const oSubscriptionContext = PodNotificationWebSocket.subscribe({
                    eventType: EventType.CUSTOM,
                    onMessage: (message) => {
                        console.log("Received message.eventType: ", message.eventType);
                        console.log("Received message.topic: ", message.topic);

                        const sContextPath = this.getPropertyValue(PropertyId.ContextPath)?.trim();
                        if (sContextPath) {
                            PodContext.set(sContextPath, message.data ?? message);
                        }

                        if (PodContext.getMessageHistory() === undefined) {
                            PodContext.setMessageHistory([]);
                        }

                        const oCardData = { ...message.data };
                        MessageHistory.push({
                            message: `${message.eventType} — ${message.eventId}`,
                            description: JSON.stringify(oCardData),
                            type: MessageHistory.Information
                        });
                    },
                    filter: Filter.and([
                        Filter.equals("subscription.plant", PodContext.getPlant()),
                        Filter.equals("subscription.workCenter", PodContext.getFilterWorkCenters()?.[0]?.workCenter)
                    ]),
                    description: "MyCustomHandler"
                });
            }
        }

        getProperties() {
            return [
                new ActionProperty({
                    id: PropertyId.ContextPath,
                    displayName: "Context Path",
                    description: "POD Context model path where the notification payload is stored (e.g. /serverNotification/custom)",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.ContextPath)
                })
            ];
        }
    }

    return ServerNotificationHandlerAction;
});
