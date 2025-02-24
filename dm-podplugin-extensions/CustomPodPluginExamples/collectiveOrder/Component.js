sap.ui.define([
	"sap/dm/dme/podfoundation/component/production/ProductionUIComponent",
	"sap/ui/Device",

], function (ProductionUIComponent, Device) {
	"use strict";

	return ProductionUIComponent.extend("sap.ext.exampleplugins.collectiveOrder.Component", {
		metadata: {
			manifest: "json"
		}
	});
});