sap.ui.define([
	"sap/dm/dme/podfoundation/component/production/ProductionUIComponent",
	"sap/ui/Device",

], function (ProductionUIComponent, Device) {
	"use strict";

	return ProductionUIComponent.extend("dmc.custom.collectiveorder.Component", {
		metadata: {
			manifest: "json"
		}
	});
});