sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"jquery.sap.global"
], function (Controller, jQuery) {
	
	var sScanHeader = "[)>";
	var sScanEOT = "{EOT}";
	var sScanRS = "{RS}";
	var sScanGS = "{GS}";
	var sDataFormat = "06";
	
	// Possible Assembly Data Fields
	var oDataFields = {
		    component: "COMPONENT",
		    serialNumber: "SERIAL_NUMBER",
		    lotNumber: "LOT_NUMBER",
		    comments: "COMMENTS",
		    sfc: "SFC",
		    inventoryIdSfc: "INVENTORY_ID_SFC"
	};

	// iso15434 Types
	var iso15434Type = [
			{
				dataField: oDataFields.component,
				prefixes: [ "19P" ]
			},
			{
				dataField: oDataFields.serialNumber,
				prefixes: [ "15S", "18S", "2C", "S", "1S"]
			},
			{
				dataField: oDataFields.lotNumber,
				prefixes: [ "T", "1T"]
			},
			{
				dataField: oDataFields.comments,
				prefixes: [ "11Z", "12Z", "13Z"]
			},
			{
				dataField: oDataFields.sfc,
				prefixes: [ "1FC"]
			},
			{
				dataField: oDataFields.inventoryIdSfc,
				prefixes: [ "1IS"]
			}
	];
		
	return {
		
		/***
		 * 
		 * parseBarcode
		 * 
		 * This will parse a 2D Barcode, in the format below:
		 * [)>06{GS}11ZThis is a test{GS}19PBRACKET{GS}26PPART_0001{GS}T002-001_LOT{GS}15S1234-4567-00-ES{GS}KPO-001-0003993{GS}1WRCO-0003-003939923{GS}VVENDOR_1{GS}D12122009{GS}TVL-000010200231{RS}{EOT}
		 * 
		 * Keep in mind, no control characters should be used.  Within the barcode scanner itself, it should be programmed to replace any control characters to one of the following:
		 * {GS} - Group Separator (ASC II of 29)
		 * {RS} - Record Separator (ASC II of 30)
		 * {EOT} - End of Text (ASC II of 4)
		 * 
		 * The scan must also include the header of "[)>" as well as the data format of "06" to be interepreted properly by the following code.
		 * 
		 * */
		parseBarcode: function(sFieldValue) {
			var oResponse = {component: null, dataFields: [], isComponent: false};
			
			// When a scan occurs, check if the scan is a component
			if (sFieldValue) {
				var aScanData = this._getISO15434ScanData(sFieldValue);
				
				// Check Format
				if (aScanData) {
					// ISO Formatted Data
					var aParsedElements = this._parseScanElements(aScanData);
					var oTranslatedData = this._translateData(aParsedElements);
					
					if (aParsedElements && oTranslatedData) {
						oResponse.isComponent = true;
						oResponse.component = oTranslatedData.component;
						oResponse.dataFields = oTranslatedData.dataFields;
					}
				}
			}
			
			return oResponse;
		},
		
		/***
		 * Get the ISO 15434 Scan Data
		 * 
		 * The value returned will contain the {GS} separated values (if found) or null.
		 **/
		_getISO15434ScanData: function( sScanValue ) {
			var iHasHeader = sScanValue.indexOf(sScanHeader);
			var iHasEOT = sScanValue.indexOf(sScanEOT);
			var iHasRS = sScanValue.indexOf(sScanRS);
			
			// Check if the header and End Of Text exists in the scan
			if (iHasHeader>-1 && iHasEOT>-1) {
				var sScanData = "";
				if (iHasRS > -1) {
					sScanData = sScanValue.substring(iHasHeader+sScanHeader.length, iHasRS);
				} else {
					sScanData = sScanValue.substring(iHasHeader+sScanHeader.length, iHasEOT);
				}
				
				return sScanData;
			}
			// Not in the expected ISO15434 Format
			return null;
		},
		
		/***
		 * Parse the Scan Elements
		 * 
		 * Return an array of all elements found, the first element will be the DataFormat, all subsequent
		 * elements will include a prefix and value.
		 **/
		_parseScanElements: function(sScanData) {
			
			if (sScanData) {
				var iHasGS = sScanData.indexOf(sScanGS);
				
				if (iHasGS>-1) {
					return sScanData.split(sScanGS);
				}
			}
			
			return null;
		},
		
		/***
		 * Translate Data
		 * 
		 * This code will iterate through all iso15434 types defined above and check if any of the prefixes
		 * found for the data field match those of the scanData received.  If they do, they will be mapped
		 * to the component, dataField or value in the response.  In addition, it will also check that
		 * the data format of "06" exists.  If any of this is not successful, a null response will be returned.
		 * 
		 * */
		_translateData: function(aScanData) {
			var aDataFields = [];
			var oResponse = {component: "", dataFields: aDataFields};
			var aPrefixes, sCurrentDataType, sCurrentScanData, sCurrentPrefix, iCurrentPrefixIndex, sDataFieldValue;
			
			// Verify we have an array
			if (aScanData.length>0) {
				// Verify the data format is what is expected
				if ( aScanData[0] === sDataFormat ) {
					
					for (var isoTypes=0; isoTypes<iso15434Type.length; isoTypes++ ) {
							aPrefixes = iso15434Type[isoTypes].prefixes;
							sCurrentDataType = iso15434Type[isoTypes].dataField;
							
							// Iterate through all Prefixes for the Data Type
							for (var prefixIndex=0; prefixIndex<aPrefixes.length; prefixIndex++) {
								// Iterate through scanned Data for a match
								for (var data=1; data<aScanData.length; data++) {
									sCurrentScanData = aScanData[data];
									sCurrentPrefix = aPrefixes[prefixIndex];
									iCurrentPrefixIndex = sCurrentScanData.indexOf(aPrefixes[prefixIndex]);
									
									// Found a match
									if (iCurrentPrefixIndex === 0) {
										sDataFieldValue = sCurrentScanData.substring(prefixIndex + sCurrentPrefix.length );
										
										// Assign Component Data
										if (sCurrentDataType === oDataFields.component) {											
											oResponse.component = sDataFieldValue;
										}
																				
										// Assign SERIAL_NUMBER
										if (sCurrentDataType === oDataFields.serialNumber) {
											aDataFields = this._addDataField(aDataFields, sCurrentDataType, sDataFieldValue);
										}
										
										// Assign LOT_NUMBER
										if (sCurrentDataType === oDataFields.lotNumber) {
											aDataFields = this._addDataField(aDataFields, sCurrentDataType, sDataFieldValue);
										}
										
										// Assign COMMENTS
										if (sCurrentDataType === oDataFields.comments) {
											aDataFields = this._addDataField(aDataFields, sCurrentDataType, sDataFieldValue);
										}
										
										// Assign SFC
										if (sCurrentDataType === oDataFields.sfc) {
											aDataFields = this._addDataField(aDataFields, sCurrentDataType, sDataFieldValue);
										}
										
										// Assign INVENTORY_ID_SFC
										if (sCurrentDataType === oDataFields.inventoryIdSfc) {
											aDataFields = this._addDataField(aDataFields, sCurrentDataType, sDataFieldValue);
										}										

									}
																
								}
							}
					}
					
					return oResponse;
				}
			}
			// Data Format not valid
			return null;
		},
		
		_addDataField: function( aDataFields, sDataField, sValue) {			
			var oDataField = {
					"fieldName": sDataField, 
			        "fieldValue": sValue
			};			
			aDataFields.push( oDataField);
			
			return aDataFields;			
		}

	};

});