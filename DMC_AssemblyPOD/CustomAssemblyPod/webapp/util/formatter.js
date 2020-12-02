sap.ui.define([
    "sap/ui/core/ValueState",
    "sap/m/Button"
], function (ValueState, Button) {
    "use strict";

    return {

    	/***
    	 * Set the row highlight
    	 */
        getStatusHighlight: function (iRemaining) {
        	if (iRemaining === 0) {
        		return ValueState.Success;
        	}
        	return ValueState.Warning;
        },

        /***
         * Set the Action button to enabled/disabled
         */
        getActionButtonState: function(iRemaining) {
        	if (iRemaining === 0) {
        		return true;
        	}
        	return false;
        },
        
        /***
         * Format the Description
         */
        getDescriptionFormat: function(sMaterial, sVersion, iRequiredQty, iRemainingQty, sUnitOfMeasure ) {
        	
        	if (jQuery.trim(sUnitOfMeasure)) {
        		return sMaterial + "/" + sVersion + "\r\n" + iRequiredQty + " " + sUnitOfMeasure + " | " + iRemainingQty + " " + sUnitOfMeasure;
        	} else {
        		return sMaterial + "/" + sVersion + "\r\n" + iRequiredQty + " | " + iRemainingQty;
        	}
        }

    };
});
