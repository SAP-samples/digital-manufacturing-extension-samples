sap.ui.define([
    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/action/metadata/ActionProperty",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/propertyeditor/StringPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/SelectPropertyEditor",
    "sap/dm/dme/pod2/api/RestClient",
    "sap/dm/dme/pod2/Logger",
    "custom/pod2/example/util/ValidationErrorHandler"
], (
    Action,
    ActionProperty,
    PodContext,
    StringPropertyEditor,
    SelectPropertyEditor,
    RestClient,
    Logger,
    ValidationErrorHandler
) => {
    "use strict";

    const PropertyId = Object.freeze({
        Destination: "destination",
        HttpMethod: "httpMethod",
        DataURL: "dataURL",
        InputPayload: "inputPayload",
        OutputRESTData: "outputRESTData"
    });

    const HttpMethod = Object.freeze({
        GET: "GET",
        POST: "POST"
    });

    const REQUEST_TIMEOUT_MS = 30000; // 30 seconds

    const oLogger = Logger.getLogger("custom.pod2.example.actions.ExternalDataFetchAction");

    class ExternalDataFetchAction extends Action {

        #sDestination = null;
        #sHttpMethod = null;
        #sDataUrl = null;
        #inputPayload = null;
        #outputRESTData = null;

        static getDisplayName() {
            return "Fetch REST Data";
        }

        static getDescription() {
            return "Fetch data from external REST API with configurable HTTP method";
        }

        constructor(oConfig) {
            super(oConfig);

            try {
                // Get destination without whitelist validation
                const sDestination = this.getPropertyValue(PropertyId.Destination);
                this.#sDestination = sDestination ? String(sDestination).trim() : null;

                this.#sHttpMethod = this.getPropertyValue(PropertyId.HttpMethod) || HttpMethod.POST;
                this.#sDataUrl = ValidationErrorHandler.validateUrl(
                    this.getPropertyValue(PropertyId.DataURL),
                    "Data URL"
                );
                this.#inputPayload = this.getPropertyValue(PropertyId.InputPayload);
                this.#outputRESTData = ValidationErrorHandler.validateContextPath(
                    this.getPropertyValue(PropertyId.OutputRESTData),
                    "Output data context"
                );
            } catch (oError) {
                oLogger.error("[ExternalDataFetchAction] Configuration error", oError);
                throw oError;
            }
        }

        /**
         * Creates a timeout promise
         * @param {number} iTimeout - Timeout in milliseconds
         * @returns {Promise} Promise that rejects after timeout
         * @private
         */
        _createTimeoutPromise(iTimeout) {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Request timeout")), iTimeout);
            });
        }

        async execute(oActionContext) {
            if (!this.#sDataUrl || !this.#outputRESTData) {
                oLogger.warning("[ExternalDataFetchAction] Missing required configuration");
                return;
            }

            try {
                let sFullUrl = this.#sDataUrl;

                // Build URL with destination if provided
                if (this.#sDestination) {
                    sFullUrl = `/destination/${this.#sDestination}${this.#sDataUrl}`;
                }

                oLogger.info("[ExternalDataFetchAction] Fetching data", {
                    method: this.#sHttpMethod,
                    url: sFullUrl
                });

                let fetchPromise;

                if (this.#sHttpMethod === HttpMethod.GET) {
                    fetchPromise = RestClient.get(sFullUrl);
                } else {
                    // Validate payload if POST
                    if (this.#inputPayload) {
                        ValidationErrorHandler.validateJson(this.#inputPayload, "Input payload");
                    }
                    fetchPromise = RestClient.post(sFullUrl, this.#inputPayload);
                }

                // Race between fetch and timeout
                const oResponse = await Promise.race([
                    fetchPromise,
                    this._createTimeoutPromise(REQUEST_TIMEOUT_MS)
                ]);

                const oData = oResponse.output_context
                    ? JSON.parse(oResponse.output_context)
                    : oResponse;

                PodContext.set("/" + this.#outputRESTData, oData);

                oLogger.info("[ExternalDataFetchAction] Data fetched successfully");

            } catch (oError) {
                oLogger.error("[ExternalDataFetchAction] Request failed", {
                    message: oError.message,
                    method: this.#sHttpMethod
                });

                // Get user-friendly error message using centralized handler
                const sErrorMsg = ValidationErrorHandler.getUserFriendlyErrorMessage(
                    oError,
                    "Failed to fetch external data"
                );

                this.showErrorMessage(sErrorMsg);

                // Clear any stale data
                PodContext.set("/" + this.#outputRESTData, null);
            }
        }

        getProperties() {
            const aProperties = [
                new ActionProperty({
                    displayName: "Destination",
                    description: "Destination name for external API (optional)",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.Destination)
                }),
                new ActionProperty({
                    displayName: "HTTP Method",
                    description: "HTTP method to use for the API call",
                    propertyEditor: new SelectPropertyEditor(
                        this,
                        PropertyId.HttpMethod,
                        {
                            GET: "GET",
                            POST: "POST"
                        },
                        HttpMethod.POST
                    )
                }),
                new ActionProperty({
                    displayName: "Data URL",
                    description: "External URL to be called (relative path)",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.DataURL)
                })
            ];

            const sHttpMethod = this.getPropertyValue(PropertyId.HttpMethod) || HttpMethod.POST;

            if (sHttpMethod === HttpMethod.POST) {
                aProperties.push(new ActionProperty({
                    displayName: "Input Payload",
                    description: "Request payload for POST method (JSON format)",
                    propertyEditor: new StringPropertyEditor(this, PropertyId.InputPayload)
                }));
            }

            aProperties.push(new ActionProperty({
                displayName: "Output Data Context",
                description: "POD Context path to store response (alphanumeric and / only)",
                propertyEditor: new StringPropertyEditor(this, PropertyId.OutputRESTData)
            }));

            return aProperties;
        }
    }

    return ExternalDataFetchAction;
});
