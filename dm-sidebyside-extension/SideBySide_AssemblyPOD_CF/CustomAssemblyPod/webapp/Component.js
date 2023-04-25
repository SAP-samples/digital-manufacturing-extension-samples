sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "sap/ui/model/json/JSONModel",
	"sap/custom/assemblypod/model/models"
], function (UIComponent, Device, JSONModel, models) {
	"use strict";
	
    var GLOBAL_MODEL_NAME = "global";

	return UIComponent.extend("sap.custom.assemblypod.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

            // init model for storing global cross controller data
            this.setModel(new JSONModel(), GLOBAL_MODEL_NAME);
		},

        /**
         * @return The global application JSONModel
         */
        getGlobalModel: function () {
            return this.getModel(GLOBAL_MODEL_NAME);
        }
	});
});
