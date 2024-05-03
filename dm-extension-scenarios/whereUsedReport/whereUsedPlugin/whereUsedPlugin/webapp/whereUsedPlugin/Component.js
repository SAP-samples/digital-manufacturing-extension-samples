sap.ui.define([
	"sap/dm/dme/podfoundation/component/production/ProductionUIComponent",
	"sap/ui/Device"
], function (ProductionUIComponent, Device) {
	"use strict";

	return ProductionUIComponent.extend("huka.custom.plugin.whereUsedPlugin.whereUsedPlugin.Component", {
		metadata: {
			manifest: "json"
		}
	});
});