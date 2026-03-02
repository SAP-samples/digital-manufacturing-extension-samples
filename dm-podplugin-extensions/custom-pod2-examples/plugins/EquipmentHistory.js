sap.ui.define([
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/dm/dme/pod2/widget/core/TableWidget",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "custom/pod2/example/client/MdoEnhancedClient",
    "sap/dm/dme/pod2/Logger"
], (
    MobileLibrary,
    Fragment,
    DateFormat,
    TableWidget,
    ModelPath,
    PodContext,
    I18nResourceModel,
    MdoEnhancedClient,
    Logger
) => {
    "use strict";

    const { Text, ObjectStatus, ToolbarSpacer, MessageToast, MessageStrip } = MobileLibrary;

    const DEFAULT_PAGE_SIZE = 50;
    const MAX_PAGE_SIZE = 100;

    const oLogger = Logger.getLogger("custom.pod2.example.plugins.EquipmentHistory");

    class EquipmentHistory extends TableWidget {

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
            return "Displays last 50 equipment usage records with dynamic resource filtering";
        }

        onInit() {
            super.onInit();
            this._bIsLoading = false;

            if (PodContext.isRunMode()) {
                PodContext.subscribe(ModelPath.FilterResources, this._onResourceChanged, this);
                this._fetchData();
            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(ModelPath.FilterResources, this._onResourceChanged, this);
            }
        }

        _getModelPath() {
            return "/packaging/equipmentHistory";
        }

        _onResourceChanged() {
            this._fetchData();
        }

        _extractResource(aResources) {
            const oResource = aResources?.[0];
            return typeof oResource === "string" ? oResource : oResource?.resource || null;
        }

        /**
         * Fetches equipment history data from MDO
         * @private
         * @async
         * @returns {Promise<void>}
         */
        async _fetchData() {
            if (this._bIsLoading) {
                oLogger.debug("[EquipmentHistory] Fetch already in progress");
                return;
            }

            this._bIsLoading = true;

            try {
                const sPlant = PodContext.getPlant();
                const sResource = this._extractResource(PodContext.get(ModelPath.FilterResources));

                if (!sPlant || !sResource) {
                    PodContext.set(this._getModelPath(), []);
                    oLogger.info("[EquipmentHistory] Plant or resource not available");
                    return;
                }

                oLogger.info("[EquipmentHistory] Fetching data", {
                    plant: sPlant,
                    resource: sResource
                });

                const oResponse = await new MdoEnhancedClient().getEquipmentHistory({
                    plant: sPlant,
                    resource: sResource,
                    pageSize: DEFAULT_PAGE_SIZE
                });

                if (oResponse?.[0]) {
                    PodContext.set(this._getModelPath(), oResponse[0]);
                    oLogger.info("[EquipmentHistory] Data loaded successfully", {
                        recordCount: oResponse[0].length
                    });
                } else {
                    PodContext.set(this._getModelPath(), []);
                    MessageToast.show(this.getI18nText("EquipmentHistory.noData") || "No equipment history data available");
                }
            } catch (oError) {
                // Log error with context (but don't log sensitive data)
                oLogger.error("[EquipmentHistory] Fetch failed", {
                    message: oError.message,
                    status: oError.status
                });

                PodContext.set(this._getModelPath(), []);

                // User-friendly error messages based on error type
                let sErrorMsg = this.getI18nText("EquipmentHistory.loadFailed") || "Failed to load equipment history";

                if (oError.status === 403) {
                    sErrorMsg = this.getI18nText("EquipmentHistory.accessDenied") || "Access denied to equipment history";
                } else if (oError.status === 404) {
                    sErrorMsg = this.getI18nText("EquipmentHistory.notFound") || "Equipment history not found";
                } else if (oError.status >= 500) {
                    sErrorMsg = this.getI18nText("EquipmentHistory.serverError") || "Server error. Please try again later";
                } else if (oError.message && oError.message.includes("illegal characters")) {
                    sErrorMsg = this.getI18nText("EquipmentHistory.invalidData") || "Invalid plant or resource data";
                }

                MessageToast.show(sErrorMsg);
            } finally {
                this._bIsLoading = false;
            }
        }

        static getFields() {
            const thisI18n = this.getI18nText.bind(this);
            return [
                { field: "material", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.material"), width: "150px" },
                { field: "order", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.order"), width: "150px" },
                { field: "sfc", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.sfc"), width: "150px" },
                { field: "sfcstatus", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.sfcstatus"), width: "150px" },
                { field: "startedAt", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.startedAt"), width: "150px" },
                { field: "completedAt", importance: "High", sortable: false, text: thisI18n("EquipmentHistory.completedAt"), width: "150px" }
            ];
        }

        _formatDateTime(sDateTime) {
            if (!sDateTime) return "";
            try {
                return DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd HH:mm:ss" }).format(new Date(sDateTime));
            } catch (oError) {
                return sDateTime;
            }
        }

        _createCell(oColumnConfig) {
            const cellMap = {
                material: () => new Text({ wrapping: true, text: "{SFCS/0/MATERIAL}" }),
                order: () => new ObjectStatus({ state: "Information", text: "{MFG_ORDER}" }),
                sfc: () => new Text({ wrapping: true, text: "{SFC}" }),
                sfcstatus: () => new Text({ wrapping: true, text: "{SFCS/0/STATUS}" }),
                startedAt: () => new Text({ wrapping: true, text: { path: "STARTED_AT", formatter: this._formatDateTime.bind(this) } }),
                completedAt: () => new Text({ wrapping: true, text: { path: "COMPLETED_AT", formatter: this._formatDateTime.bind(this) } })
            };

            return cellMap[oColumnConfig.field]?.() || super._createCell(oColumnConfig);
        }

        async _createToolbarContent() {
            const aControls = super._createToolbarContent().filter(c => !c.getId().endsWith("sort"));

            const sInfoText = this.getI18nText("EquipmentHistory.showingRecords", [DEFAULT_PAGE_SIZE]) ||
                `📊 Showing last ${DEFAULT_PAGE_SIZE} records (most recent first)`;

            const oInfoText = new Text({
                text: sInfoText,
                class: "sapUiSmallMarginEnd"
            }).addStyleClass("sapUiTinyMarginTop");

            aControls.unshift(oInfoText);

            try {
                const oFragment = await Fragment.load({
                    name: "custom.pod2.example.fragments.EquipmentHistoryToolbar",
                    controller: this
                });

                const iIndex = aControls.findIndex(c => c instanceof ToolbarSpacer);
                aControls.splice(iIndex + 1 || aControls.length, 0, oFragment);

                this.getTable()?.getHeaderToolbar()?.removeAllContent();
                aControls.forEach(c => this.getTable()?.getHeaderToolbar()?.addContent(c));
            } catch (oError) {
                oLogger.error("[EquipmentHistory] Failed to load toolbar fragment", oError);
            }

            return aControls;
        }

        onRefreshPress() {
            this._fetchData();
        }
    }

    return EquipmentHistory;
});