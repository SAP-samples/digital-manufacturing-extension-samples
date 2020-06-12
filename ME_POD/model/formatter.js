sap.ui.define([], function () {
	"use strict";
	return {
		getStatusColor: function (code) {
			if (code) {
				switch (code) {
				case "403":
					return "green";
				case "402":
					return "blue";
				case "401":
					return "grey";
				}

			} else {
				return "grey";
			}
		},

		getStatusIcon: function (code) {
			if (code) {
				switch (code) {
				case "403":
					return "sap-icon://color-fill";
				case "402":
					return "sap-icon://circle-task-2";
				case "401":
					return "sap-icon://rhombus-milestone-2";
				}
			} else {
				return "sap-icon://rhombus-milestone-2";
			}
		},

		getComponentStatus: function (quantity) {
			if (quantity > 0) {
				return true;
			} else {
				return false;
			}
		},
		getDCValueHelpOnly: function (code) {
			if (code) {
				switch (code) {
				case "DATA_FIELD_LIST":
					return true;
				case "BOOLEAN":
					return true;
				default:
					return false;
				}
			} else {
				return false;
			}
		},
		getOperationStatusDescription: function (code) {
			if (jQuery.sap.endsWith(code, "201")) {
				return "Releasable";
			} else if (jQuery.sap.endsWith(code, "202")) {
				return "Frozen";
			} else if (jQuery.sap.endsWith(code, "203")) {
				return "Obsolete";
			} else if (jQuery.sap.endsWith(code, "204")) {
				return "Hold";
			} else if (jQuery.sap.endsWith(code, "205")) {
				return "New";
			} else {
				return "";
			}
		},
		getResourceStatusDescription: function (code, site) {
			if ((code) === ("StatusBO:" + site + "," + "0"))  {
				return "Unknown";
			}else if ((code) === ("StatusBO:" + site + "," + "1"))  {
				return "Productive";
			}else if ((code) === ("StatusBO:" + site + "," + "2"))  {
				return "Standby";
			}else if ((code) === ("StatusBO:" + site + "," + "3"))  {
				return "Engineering";
			}else if ((code) === ("StatusBO:" + site + "," + "301"))  {
				return "Enabled";
			}else if ((code) === ("StatusBO:" + site + "," + "302"))  {
				return "Disabled";
			}else if ((code) === ("StatusBO:" + site + "," + "303"))  {
				return "Hold";
			}else if ((code) === ("StatusBO:" + site + "," + "4"))  {
				return "Scheduled Down";
			}else if ((code) === ("StatusBO:" + site + "," + "5"))  {
				return "Unscheduled Down";
			}else if ((code) === ("StatusBO:" + site + "," + "6"))  {
				return "Non-scheduled";
			}else if ((code) === ("StatusBO:" + site + "," + "HOLD_CONSEC_NC_R"))  {
				return "Hold Consec NC";
			}else if ((code) === ("StatusBO:" + site + "," + "HOLD_SPC_VIOL_R"))  {
				return "Hold SPC Violation";
			}else if ((code) === ("StatusBO:" + site + "," + "HOLD_SPC_WARN_R"))  {
				return "Hold SPC Warning";
			}else if ((code) === ("StatusBO:" + site + "," + "HOLD_YLD_RATE_R"))  {
				return "Hold Yield Rate";
			}else
			{
				return "Unknown";
			}

		}
	};

});