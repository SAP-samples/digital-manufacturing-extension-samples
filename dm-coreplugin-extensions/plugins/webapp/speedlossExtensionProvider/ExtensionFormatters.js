sap.ui.define([], function() {
    "use strict";

    function isSelectable(oReasonCode) {
        return typeof(oReasonCode.timeElementReasonCodeTree) === "undefined";
    };

    function hasChildren(oReasonCode) {
        return oReasonCode.timeElementReasonCodeTree &&
            oReasonCode.timeElementReasonCodeTree.length > 0;
    };

    return {
        gridListItemType: function(oReasonCode) {
            if (isSelectable(oReasonCode) || hasChildren(oReasonCode)) {
                return sap.m.ListType.Active;
            }
            return sap.m.ListType.Inactive;
        },

        gridListItemHighlight: function(oReasonCode) {
            if (isSelectable(oReasonCode)) {
                return "Information";
            }
        },

        expandIconVisible: function(oReasonCode) {
            if (!isSelectable(oReasonCode) && hasChildren(oReasonCode)) {
                return true;
            }
            return false;
        },

        acceptIconVisible: function(oReasonCode) {
            return isSelectable(oReasonCode);
        }
    };
});
