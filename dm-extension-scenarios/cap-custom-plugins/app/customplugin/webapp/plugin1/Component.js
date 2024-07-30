sap.ui.define([
	"sap/dm/dme/podfoundation/component/production/ProductionUIComponent"
], function (ProductionUIComponent) {
	"use strict";

	return ProductionUIComponent.extend("cap.custom.plugins.customplugin.plugin1.Component", {
		metadata: {
			manifest: "json"
		}
	});
});