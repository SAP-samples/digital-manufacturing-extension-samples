/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/sap/me/customOperationPOD/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/sap/me/customOperationPOD/test/integration/pages/MainView",
	"com/sap/me/customOperationPOD/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.me.customOperationPOD.view.",
		autoWait: true
	});
});