sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "sap.custom.plugins.urlintegration.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			
			this.setI18nKeyPrefix("customComponentListConfig.");
			this.setResourceBundleName("sap.custom.plugins.urlintegration.i18n.builder");
			this.setPluginResourceBundleName("sap.custom.plugins.urlintegration.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
			
			this.addSwitch(oPropertyFormContainer, "backButtonVisible", oData);
			this.addSwitch(oPropertyFormContainer, "closeButtonVisible", oData);
			
			oFormContainer = oPropertyFormContainer;
			
			this.addInputField(oPropertyFormContainer, "Text", oData);
			this.addInputField(oPropertyFormContainer, "LogoUrl", oData);
			
			this.addInputField(oPropertyFormContainer, "Url", oData);
			
			
			this.addInputField(oPropertyFormContainer, "Param1Key", oData);
			this.addInputField(oPropertyFormContainer, "Param1Value", oData);
			
			this.addInputField(oPropertyFormContainer, "Param2Key", oData);
			this.addInputField(oPropertyFormContainer, "Param2Value", oData);
			
			this.addInputField(oPropertyFormContainer, "Param3Key", oData);
			this.addInputField(oPropertyFormContainer, "Param3Value", oData);
		},
		
		getDefaultPropertyData: function(){
			return {
				"backButtonVisible" : true,
				"closeButtonVisible" : false,
				"tableConfiguration" : {
					alternateRowColors : true,
					fixedLayout : false,
					stickyHeader : true 
				} 
			};
		}

	});
});