sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel",
    "sap/custom/assemblypod/controller/Constants"
], function (BaseObject, ResourceModel, Constants) {
    "use strict";
    
    
    var RequestProcessor = BaseObject.extend("userAssignmentApp", {
        constructor: function (oApplicationUtil) {
            this._oApplicationUtil = oApplicationUtil;
        }
    });

        
    /**
     * Returns Public API REST datasource URI
     */
    RequestProcessor.prototype.getPublicApiRestDataSourceUri = function () {
        return this.getOwnerComponent().getManifestEntry(Constants.PUBLIC_API_REST_PATH);
    };

    /**
     * Returns GET request URL to retrieve SFC Data for the input SFC name
     * @param {string} sPlant Plant
     * @param {string} sSfc <string> SFC
     * @param {string} sWorkCenter <string> Work Center
     * @returns {object} in the form {"type": "GET", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getSfcRequestData = function(sPlant, sSfc, sWorkCenter) {
        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "sfc/v1/sfcdetail?plant=" + sPlant + "&sfc=" + sSfc;
        
        return {
            "type": "GET",
            "url": sUrl,
            "parameters": null
        };
    };
   
    return RequestProcessor;
});
