sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel",
    "sap/custom/assemblypod/controller/Constants"
], function (BaseObject, ResourceModel, Constants) {
    "use strict";
    
    var IMAGE_MIME_GROUP_CODE = "2";

    var RequestProcessor = BaseObject.extend("sap.custom.assemblypod.util.RequestProcessor", {
        constructor: function (oApplicationUtil) {
            this._oApplicationUtil = oApplicationUtil;
        }
    });

    /**
     * Returns AIN OData datasource URI
     */
    RequestProcessor.prototype.getOwnerComponent = function () {
        return this._oApplicationUtil.getOwnerComponent();
    };

    /**
     * Returns AIN OData datasource URI
     */
    RequestProcessor.prototype.getAinDataSourceUri = function () {
        return this.getOwnerComponent().getManifestEntry(Constants.AIN_DS_PATH);
    };

    /**
     * Returns AIN REST datasource URI
     */
    RequestProcessor.prototype.getAinRestDataSourceUri = function () {
        return this.getOwnerComponent().getManifestEntry(Constants.AIN_DS_REST_PATH);
    };

    
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
    
    /**
     * Translates the response from the request to application response
     * @param {object} oResponse Response from request
     * @returns {object} object containing sfc and operation data
     * @public
     */
    RequestProcessor.prototype.sfcResponseMapper = function(oResponse) {
        if (!oResponse || !jQuery.trim(oResponse.sfc)) {
            return null;
        }
        
        var oStartDateTime, oEndDateTime;
        if (jQuery.trim(oResponse.order.orderPlannedStartDateTime)) {
            oStartDateTime = new Date(oResponse.order.orderPlannedStartDateTime);
        }
        if (jQuery.trim(oResponse.order.orderPlannedCompleteDateTime)) {
            oEndDateTime = new Date(oResponse.order.orderPlannedCompleteDateTime);
        }
        
        var oStepData = this._findCurrentStepData(oResponse);

        var sStepStatus = "COMPLETE";
        var sStepId, sWorkCenter, sOperation, sOperationVersion, sOperationDescription;
        if (oStepData && oStepData.step) {
            sStepId = oStepData.step.stepId;
            sWorkCenter = oStepData.step.plannedWorkCenter;
            sOperation = oStepData.step.operation.operation;
            sOperationVersion = oStepData.step.operation.version;
            sOperationDescription = oStepData.step.operation.description;
            sStepStatus = oStepData.status;
        }

        var oResponseData = {
            "sfc": oResponse.sfc,
            "material": oResponse.material.material,
            "materialDescription": oResponse.material.description,
            "materialVersion": oResponse.material.version,
            "materialAndVersion": oResponse.material.material + "/" + oResponse.material.version,
            "shopOrder": oResponse.order.order,
            "workCenter": sWorkCenter,
            "statusCode": oResponse.status.code, 
            "statusDescription": oResponse.status.description,
            "stepStatus": sStepStatus,
            "sfcQuantity": oResponse.quantity,
            "startDatetime": oStartDateTime,
            "endDatetime": oEndDateTime,
            "stepId": sStepId,
            "operation": sOperation,
            "operationVersion": sOperationVersion,
            "operationDescription": sOperationDescription,
            "operationStepId": sStepId
        };
        return oResponseData;
    };
    
    RequestProcessor.prototype._findCurrentStepData = function(oResponseData) {
        var sStatusCode = oResponseData.status.code;
        for (var i = 0; i < oResponseData.steps.length; i++) {
            if ((sStatusCode === "401" || sStatusCode === "402") && 
                oResponseData.steps[i].quantityInQueue > 0) {
                // NEW or In-Queue and still shows quantity in-queue
                return {step: oResponseData.steps[i], status: "IN_QUEUE"};
                
            } else if (sStatusCode === "403" && 
                oResponseData.steps[i].quantityInWork > 0) {
                // In-Work and still has Quanitity in work
                return {step: oResponseData.steps[i], status: "IN_WORK"};
            }
        }
        return null;
    };
    
    /**
     * Returns the request data to retrieve SFC Assembly Data for the input SFC name & Operation
     * @param {string} sPlant Plant
     * @param {string} sSfc <string> SFC
     * @param {string} sOperation <string> Operation
     * @returns {object} in the form {"type": "...", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getComponentsRequestData = function(sPlant, sSfc, sOperation) {

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "assembly/v1/plannedComponents";
        var oParameters = {
            "plant": sPlant,
            "sfc": sSfc,
            "operationActivity": sOperation
        };
        
        return {
            "type": "GET",
            "url": sUrl,
            "parameters": oParameters
        };
    };

    /**
     * Translates the response from the request to application response
     * @param {object} oResponse List of Components's returned from backend
     * @returns {Array} array of components for application use
     * @public
     */
    RequestProcessor.prototype.componentsResponseMapper = function(oResponse) {
        if (!oResponse || oResponse.length === 0) {
            return null;
        }

        var aMappedComponents = [];
        for (var i = 0; i < oResponse.length; i++) {
            
            var sDataType = oResponse[i].assemblyDataType;
            if (!jQuery.trim(oResponse[i].assemblyDataType)) {
                sDataType = this._oApplicationUtil.getI18nText("dataType.NONE");
            }
            aMappedComponents[aMappedComponents.length] = {
                "plant": oResponse[i].plant,
                "component": oResponse[i].component,
                "componentVersion": oResponse[i].componentVersion,
                "componentDescription": oResponse[i].componentDescription,
                "requiredQuantity": oResponse[i].requiredQuantity,
                "remainingQuantity": oResponse[i].remainingQuantity,
                "assembledQuantity": oResponse[i].assembledQuantity,
                "componentSequence": oResponse[i].componentSequence,
                "assemblyDataType": sDataType
            };
        }
        
        return aMappedComponents;
    };
    
    /**
     * Returns the request data to get the assembled Data for the input SFC name & Operation
     * @param {string} sPlant Plant
     * @param {string} sSfc <string> SFC
     * @param {string} sOperation <string> Operation
     * @returns {object} in the form {"type": "...", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getAssembledComponentsRequestData = function(sPlant, sSfc, sOperation) {

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "assembly/v1/assembledComponents";

        var oParameters = {
            "plant": sPlant,
            "sfc": sSfc,
            "operationActivity": sOperation
        };
        
        return {
            "type": "GET",
            "url": sUrl,
            "parameters": oParameters
        };
    };

    /**
     * Translates the response from the request to application response
     * @param {object} oResponse List of Components's returned from backend
     * @returns {Array} array of assembled components data for application use:
     * @public
     */
    RequestProcessor.prototype.assembledComponentsResponseMapper = function(aResponse) {
        if (!aResponse || aResponse.length === 0) {
            return null;
        }
        var aMappedResponse = [];
        for (var i = 0; i < aResponse.length; i++) {
            aMappedResponse[aMappedResponse.length] = {
                assemblyId: aResponse[i].assemblyId,
                component: aResponse[i].component,
                componentVersion: aResponse[i].componentVersion,
                description: aResponse[i].description,
                assembledQuantity: aResponse[i].assembledQuantity,
                assembledDate: aResponse[i].assembledDate,
                unitOfMeasure: aResponse[i].unitOfMeasure,
                dataFields: aResponse[i].assemblyDataFields
            };
        }
        return aMappedResponse;
    };
    
    /**
     * Returns the request data to add a component
     * @param {string} sPlant Plant
     * @param {object} oRequestData Request data:
     * <pre>
     *  var oRequestData = {
     *      resource: "",
     *      sfc: "",
     *      operation: "",
     *      component: "",
     *      componentVersion: "",
     *      quantity: n,
     *      dataFields: [{fieldName: sFieldName, value: oValue}, {}, ..]
     *  };
     * </pre>
     * @returns {object} in the form {"type": "...", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.addComponentRequestData = function(sPlant, oRequestData) {

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "assembly/v1/assembledComponents";

        var oParameters = {
            "plant": sPlant,
            "operationActivity": oRequestData.operation,
            "resource": oRequestData.resource,
            "sfc": oRequestData.sfc,
            "component": oRequestData.component,
            "componentVersion": oRequestData.componentVersion,
            "quantity": oRequestData.quantity,
            "dataFields": oRequestData.dataFields
        };
        
        return {
            "type": "POST",
            "url": sUrl,
            "parameters": oParameters
        };
    };

    /**
     * Translates the response from the request to application response
     * @param {object} oResponse Response from add
     * @return {object} Returned information
     * @public
     */
    RequestProcessor.prototype.addComponentsResponseMapper = function(oResponse) {
        // API returns void - nothing to map
        return oResponse;
    };

    /**
     * Returns the request data to remove a component
     * @param {string} sPlant Plant
     * @param {object} oRequestData Request data:
     * <pre>
     *  var oRequest = {
     *      plant: "",
     *      resource: "",
     *      sfc: "",
     *      operation: "",
     *      component: "",
     *      componentVersion: "",
     *      quantity: n
     *  };
     * </pre>
     * @returns {object} in the form {"type": "...", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.removeComponentRequestData = function(sPlant, oRequestData) {

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "assembly/v1/assembledComponents";

        var oParameters = {
            "plant": sPlant,
            "operationActivity": oRequestData.operation,
            "resource": oRequestData.resource,
            "sfc": oRequestData.sfc,
            "component": oRequestData.component,
            "componentVersion": oRequestData.componentVersion,
            "quantity": oRequestData.quantity
        };
        
        return {
            "type": "DELETE",
            "url": sUrl,
            "parameters": oParameters
        };
    };

    /**
     * Called if successful removal of component
     * @param {object} oResponse Response from remove
     * @return {object} response
     * @public
     */
    RequestProcessor.prototype.removeComponentResponseMapper = function(oResponse) {
        // API returns void - nothing to map
        return oResponse;
    };

    /**
     * Returns the POST request data to Start an SFC
     * @param {string} sPlant Plant
     * @param {string}  sSfc SFC to Start
     * @param {string}  sOperation Operation to start at
     * @param {string}  sResource Resource
     * @param {float}  fQuantity Quantity
     * @returns {object} in the form {"type": "POST", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getStartSfcRequestData = function(sPlant, sSfc, sOperation, sResource, fQuantity) {
        var aSfcNames = [];
        aSfcNames.push( sSfc );
        
        var oParameters = {
            plant: sPlant,
            sfcs: aSfcNames,
            operation: sOperation,
            resource: sResource,
            quantity: fQuantity
        };

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "sfc/v1/sfcs/start";
        
        return {
            "type": "POST",
            "url": sUrl,
            "parameters": oParameters
        };
    };
    
    /**
     * Translates the response from the request to application response
     * @param {object}  oResponse to starting sfc
     * @returns {object}  mapped response
     * @public
     */
    RequestProcessor.prototype.startSfcResponseMapper = function(oResponse) {
        return oResponse;
    };

    /**
     * Returns the POST request data to Complete an SFC
     * @param {string} sPlant Plant
     * @param {string} sSfc SFC to Complete
     * @param {string} sOperation Operation to Complete
     * @param {string} sResource Resource
     * @param {float} fQuantity Quantity
     * @returns {object} in the form {"type": "POST", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getCompleteSfcRequestData = function(sPlant, sSfc, sOperation, sResource, fQuantity) {
        var aSfcNames = [];
        aSfcNames.push( sSfc );
        
        var oParameters = {
            plant: sPlant,
            sfcs: aSfcNames,
            operation: sOperation,
            resource: sResource,
            quantity: fQuantity
        };

        var sUrl = this.getPublicApiRestDataSourceUri();
        sUrl = sUrl + "sfc/v1/sfcs/complete";
        
        return {
            "type": "POST",
            "url": sUrl,
            "parameters": oParameters
        };
    };
    
    /**
     * Translates the response from the request to application response
     * @param {object}  oResponse to completing sfc
     * @returns {object}  mapped response
     * @public
     */
    RequestProcessor.prototype.completeSfcResponseMapper = function(oResponse) {
        return oResponse;
    };

    /**
     * Returns the URL to retrieve the default (thumbnail) material file id
     * @param {string}  sPlant
     * @param {string}  sMaterial
     * @param {string}  sMaterialVersion
     * @return {object} in the form {"type": "POST", "url": "", "parameters": {}}
     * @public
     */
    RequestProcessor.prototype.getMaterialFileIdRequestData = function(sPlant, sMaterial, sMaterialVersion) {   
        var sUrl = this.getPublicApiRestDataSourceUri();
        //sUrl = sUrl + "Materials('ItemBO%3a" + sPlant + "%2c" + sMaterial + "%2c" + sMaterialVersion + "')";
        //sUrl = sUrl + "?$select=*&$expand=materialFileAttachments($select=ref,fileId,isDefault)&$format=json";
        
        sUrl = sUrl + "material/v1/materials?plant=" + sPlant + "&material=" + sMaterial;
        return {
            "type": "GET",
            "url": sUrl,
            "parameters": null
        };
    };
    
    /**
     * Translates the response from the request to application response
     * @param {object} oResponse to getting material information
     * @returns {object} material file id
     * @public
     */
    RequestProcessor.prototype.materialFileIdResponseMapper = function(oResponse) {
        var sMaterialFileId = null;
        if (oResponse && oResponse.materialFileAttachments && oResponse.materialFileAttachments.length > 0) {
            for (var i = 0; i < oResponse.materialFileAttachments.length; i++) {
                if (oResponse.materialFileAttachments[i].isDefault) {
                    sMaterialFileId = oResponse.materialFileAttachments[i].fileId;
                    break;
                }
            }
        }
        return sMaterialFileId;
    };
    
    /**
     * Returns the URL to retrieve the material image file URI
     * @param {string} sFileId file id to get information for
     * @returns {string} URL
     * @public
     */
    RequestProcessor.prototype.getMaterialFileImageUrl = function(sFileId) {  
        return this.getAinDataSourceUri() + "GetAllDocuments('" + sFileId + "')?$format=json";
    };
    
    /**
     * Translates the response from the request to application response
     * @param {object} oResponse to getting material image URL
     * @return {string} material image url
     * @public
     */
    RequestProcessor.prototype.materialFileImageResponseMapper = function(sFileId, oResponse) {
        var sFileImageUri = null;
        if (oResponse && oResponse.d) {
            if (oResponse.d.mimeGroupCode === IMAGE_MIME_GROUP_CODE) {
                sFileImageUri = this.getAinRestDataSourceUri() + "attachments/download/" + sFileId + "?lang=en";
                //sFileImageUri = sFileImageUri + "&resolution=96*96";
            }
        }
        return sFileImageUri;
    };
    
    return RequestProcessor;
});
