sap.ui.define([
	"sap/custom/assemblypod/controller/BaseController",
	"sap/base/Log"
], function(BaseController, Log) {
	"use strict";

	return BaseController.extend("sap.custom.assemblypod.controller.App", {
		onInit: function () {
			// The default log level of the current running environment may be higher than INFO,
			// in order to see the debug info in the console, the log level needs to be explicitly
			// set to INFO here.
			// But for application development, the log level doesn't need to be set again in the code.
			//Log.setLevel(Log.Level.INFO);
		}
	});

});