sap.ui.define([
    "sap/m/Text",
    "sap/m/ObjectStatus",
    "sap/m/ToolbarSpacer",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/dm/dme/pod2/widget/core/TableWidget",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/IntegerPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "custom/pod2/example/client/MdoEnhancedClient"
], (
    Text,
    ObjectStatus,
    ToolbarSpacer,
    MessageToast,
    Fragment,
    TableWidget,
    ModelPath,
    PodContext,
    I18nResourceModel,
    WidgetProperty,
    IntegerPropertyEditor,
    PropertyCategory,
    MdoEnhancedClient
) => {
    "use strict";

    /**
     * Equipment History Widget
     * Displays equipment usage history with dynamic resource filtering and pagination
     */
    class EquipmentHistory extends TableWidget {

        static PropertyId = Object.freeze({
            PageSize: "pageSize"
        });

        static #DEFAULT_PAGE_SIZE = 20;
        static #MIN_PAGE_SIZE = 1;
        static #MAX_PAGE_SIZE = 100;
        static #oI18nModel = new I18nResourceModel("custom/pod2/example/plugins/i18n/i18n");

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "Equipment History";
        }

        static getCategory() {
            return "Sample Custom Extensions";
        }

        static getDescription() {
            return "Displays equipment usage history with pagination and dynamic resource filtering";
        }

        static getDefaultConfig() {
            const oConfig = super.getDefaultConfig();
            oConfig.properties = oConfig.properties || {};
            oConfig.properties[EquipmentHistory.PropertyId.PageSize] = this.#DEFAULT_PAGE_SIZE;
            return oConfig;
        }

        onInit() {
            super.onInit();
            this._bIsLoading = false;

            if (PodContext.isRunMode()) {
                // Subscribe to filter resource changes to refresh data when resource changes
                PodContext.subscribe(
                    ModelPath.FilterResources,
                    this._onResourceChanged,
                    this
                );

                // Initial data fetch
                this._fetchData();
            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                // Unsubscribe from resource changes
                PodContext.unsubscribe(ModelPath.FilterResources, this._onResourceChanged, this);
            }
        }

        _getModelPath() {
            return "/packaging/equipmentHistory";
        }

        _onResourceChanged() {
            // Refresh data when resource changes
            this._fetchData();
        }

        /**
         * Clears the equipment history data in the model
         * @private
         */
        _clearData() {
            PodContext.set(this._getModelPath(), []);
        }

        /**
         * Extracts the resource string from the filter resources array
         * @param {Array} aFilterResources - Array of filter resources
         * @returns {string|null} The resource string or null if not found
         * @private
         */
        _extractResource(aFilterResources) {
            if (!aFilterResources || aFilterResources.length === 0) {
                return null;
            }

            const oFirstResource = aFilterResources[0];

            // Handle both object with resource property and direct string
            if (typeof oFirstResource === "string") {
                return oFirstResource;
            }

            if (oFirstResource && typeof oFirstResource === "object" && oFirstResource.resource) {
                return oFirstResource.resource;
            }

            console.warn("Unable to extract resource from filter resources:", oFirstResource);
            return null;
        }

        /**
         * Validates the API response structure
         * @param {*} oResponse - The response to validate
         * @returns {boolean} True if response is valid
         * @private
         */
        _isValidResponse(oResponse) {
            return oResponse && Array.isArray(oResponse) && oResponse.length > 0;
        }

        /**
         * Shows an error message to the user
         * @param {string} sMessage - The error message to display
         * @private
         */
        _showErrorMessage(sMessage) {
            MessageToast.show(sMessage, {
                duration: 3000,
                width: "15em"
            });
        }

        /**
         * Gets a localized error message
         * @param {string} sKey - The i18n key
         * @param {string} sFallback - Fallback message if key not found
         * @returns {string} The localized message
         * @private
         */
        _getErrorMessage(sKey, sFallback) {
            try {
                return this.getI18nText(sKey) || sFallback;
            } catch (oError) {
                return sFallback;
            }
        }

        /**
         * Fetches equipment history data from the API
         * @async
         * @private
         */
        async _fetchData() {
            // Prevent concurrent requests
            if (this._bIsLoading) {
                console.warn("Data fetch already in progress, skipping duplicate request");
                return;
            }

            this._bIsLoading = true;

            try {
                // Get plant and resource from PodContext
                const sPlant = PodContext.getPlant();

                if (!sPlant) {
                    console.warn("No plant configured in POD context");
                    this._clearData();
                    return;
                }

                const aFilterResources = PodContext.get(ModelPath.FilterResources);
                const sResource = this._extractResource(aFilterResources);

                if (!sResource) {
                    console.warn("No resource selected in POD context");
                    this._clearData();
                    return;
                }

                // Get and validate page size from configuration
                let iPageSize = this.getPropertyValue(EquipmentHistory.PropertyId.PageSize);

                if (!iPageSize || iPageSize < EquipmentHistory.#MIN_PAGE_SIZE) {
                    console.warn(`Invalid page size ${iPageSize}, using default ${EquipmentHistory.#DEFAULT_PAGE_SIZE}`);
                    iPageSize = EquipmentHistory.#DEFAULT_PAGE_SIZE;
                } else if (iPageSize > EquipmentHistory.#MAX_PAGE_SIZE) {
                    console.warn(`Page size ${iPageSize} exceeds maximum, capping at ${EquipmentHistory.#MAX_PAGE_SIZE}`);
                    iPageSize = EquipmentHistory.#MAX_PAGE_SIZE;
                }

                // Fetch equipment history data
                const oMdoClient = new MdoEnhancedClient();
                const oResponse = await oMdoClient.getEquipmentHistory({
                    plant: sPlant,
                    resource: sResource,
                    pageSize: iPageSize,
                    page: 0
                });

                // Validate and set response
                if (this._isValidResponse(oResponse)) {
                    PodContext.set(this._getModelPath(), oResponse[0]);
                } else {
                    const sMessage = this._getErrorMessage(
                        "EquipmentHistory.noDataAvailable",
                        "No equipment history data available"
                    );
                    console.warn("Invalid or empty response received:", oResponse);
                    this._clearData();
                    this._showErrorMessage(sMessage);
                }
            } catch (oError) {
                // Enhanced error logging with context
                console.error("Failed to fetch equipment history:", {
                    error: oError,
                    message: oError?.message,
                    stack: oError?.stack,
                    plant: PodContext.getPlant(),
                    timestamp: new Date().toISOString()
                });

                this._clearData();

                // Show user-friendly error message
                const sErrorMessage = this._getErrorMessage(
                    "EquipmentHistory.fetchError",
                    "Failed to load equipment history. Please try again."
                );
                this._showErrorMessage(sErrorMessage);
            } finally {
                this._bIsLoading = false;
            }
        }

        static getFields() {
            const thisI18n = this.getI18nText.bind(this);
            return [
                {
                    field: "material",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.material"),
                    width: "150px"
                },
                {
                    field: "order",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.order"),
                    width: "150px"
                },
                {
                    field: "sfc",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.sfc"),
                    width: "150px"
                },
                {
                    field: "sfcstatus",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.sfcstatus"),
                    width: "150px"
                },
                {
                    field: "startedAt",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.startedAt"),
                    width: "150px"
                },
                {
                    field: "completedAt",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("EquipmentHistory.completedAt"),
                    width: "150px"
                }
            ];
        }

        _createCell(oColumnConfig) {
            const cellMap = {
                material: () => new Text({
                    wrapping: true,
                    text: "{SFCS/0/MATERIAL}"
                }),
                order: () => new ObjectStatus({
                    state: "Information",
                    text: "{MFG_ORDER}"
                }),
                sfc: () => new Text({
                    wrapping: true,
                    text: "{SFC}"
                }),
                sfcstatus: () => new Text({
                    wrapping: true,
                    text: "{SFCS/0/STATUS}"
                }),
                startedAt: () => new Text({
                    wrapping: true,
                    text: "{STARTED_AT}"
                }),
                completedAt: () => new Text({
                    wrapping: true,
                    text: "{COMPLETED_AT}"
                })
            };

            const createCellFn = cellMap[oColumnConfig.field];
            return createCellFn ? createCellFn() : super._createCell(oColumnConfig);
        }

        async _createToolbarContent() {
            let aControls = super._createToolbarContent();

            // Remove sort button
            aControls = aControls.filter((oControl) => !oControl.getId().endsWith("sort"));

            try {
                // Load toolbar fragment and add custom buttons
                const oFragment = await Fragment.load({
                    name: "custom.pod2.example.fragments.EquipmentHistoryToolbar",
                    controller: this
                });

                // Find spacer index and insert fragment after it
                const iSpacerIndex = aControls.findIndex((oControl) => oControl instanceof ToolbarSpacer);
                if (iSpacerIndex >= 0) {
                    aControls.splice(iSpacerIndex + 1, 0, oFragment);
                } else {
                    aControls.push(oFragment);
                }

                // Refresh toolbar
                const oToolbar = this.getTable()?.getHeaderToolbar();
                if (oToolbar) {
                    oToolbar.removeAllContent();
                    aControls.forEach((oControl) => {
                        oToolbar.addContent(oControl);
                    });
                }
            } catch (oError) {
                console.error("Failed to load toolbar fragment:", {
                    error: oError,
                    message: oError?.message,
                    fragmentName: "custom.pod2.example.fragments.EquipmentHistoryToolbar"
                });
            }

            return aControls;
        }

        onRefreshPress() {
            // Refresh equipment history data
            this._fetchData();
        }

        getProperties() {
            const aProperties = [
                ...super.getProperties(),
                new WidgetProperty({
                    displayName: this.getI18nText("EquipmentHistory.pageSize"),
                    description: this.getI18nText("EquipmentHistory.pageSizeDesc"),
                    category: PropertyCategory.Main,
                    propertyEditor: new IntegerPropertyEditor(
                        this,
                        EquipmentHistory.PropertyId.PageSize,
                        EquipmentHistory.#DEFAULT_PAGE_SIZE
                    )
                })
            ];
            return aProperties;
        }
    }

    return EquipmentHistory;
});