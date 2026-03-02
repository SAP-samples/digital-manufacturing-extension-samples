sap.ui.define([
    "sap/dm/dme/pod2/api/mdo/MDO",
    "sap/dm/dme/pod2/api/mdo/MdoApiClient",
    "sap/dm/dme/pod2/api/odata/ODataV4Client"
],

    (

        MDO,
        MdoApiClient,
        ODataV4Client
    ) => {
        "use strict";


        class MdoEnhancedClient extends MdoApiClient {

            #oMdoClient = ODataV4Client.getMdoClient();



            async getEquipmentHistory(oRequest) {


                return await this.#oMdoClient.getPage(MDO.SfcStepStatus, {
                    $top: oRequest.pageSize,
                    $skip: oRequest.page * oRequest.pageSize,
                    $select: "*",
                    $orderby: "WORKCENTER",
                    $filter: "RESOURCE eq '" + oRequest.resource + "'",
                    $expand: "SFCS"
                });
            }
        }
        return MdoEnhancedClient;
    });