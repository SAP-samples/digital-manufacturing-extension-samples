sap.ui.define([
    "sap/dm/dme/pod2/api/mdo/MDO",
    "sap/dm/dme/pod2/api/mdo/MdoApiClient",
    "sap/dm/dme/pod2/api/odata/ODataV4Client",
    "custom/pod2/example/util/ValidationErrorHandler"
], (
    MDO,
    MdoApiClient,
    ODataV4Client,
    ValidationErrorHandler
) => {
    "use strict";

    class MdoEnhancedClient extends MdoApiClient {

        #oMdoClient = ODataV4Client.getMdoClient();

        /**
         * Retrieves equipment history for a given plant and resource
         * @param {Object} oRequest - Request parameters
         * @param {string} oRequest.plant - Plant identifier
         * @param {string} oRequest.resource - Resource identifier
         * @param {number} oRequest.pageSize - Number of records to retrieve
         * @returns {Promise<Array>} Equipment history records
         * @throws {Error} If validation fails
         */
        async getEquipmentHistory(oRequest) {
            // Validate input parameters using centralized validator
            ValidationErrorHandler.validateObject(oRequest, "request object");

            const sPlant = ValidationErrorHandler.validateFilterValue(oRequest.plant, "Plant");
            const sResource = ValidationErrorHandler.validateFilterValue(oRequest.resource, "Resource");
            const iPageSize = ValidationErrorHandler.validatePageSize(oRequest.pageSize);

            const sPlantFilter = `PLANT eq '${sPlant}'`;
            const sResourceFilter = `RESOURCE eq '${sResource}'`;

            return await this.#oMdoClient.getPage(MDO.SfcStepStatus, {
                $top: iPageSize,
                $skip: 0,
                $select: "*",
                $orderby: "CREATED_AT desc",
                $filter: `${sPlantFilter} and ${sResourceFilter}`,
                $expand: "SFCS"
            });
        }
    }

    return MdoEnhancedClient;
});
