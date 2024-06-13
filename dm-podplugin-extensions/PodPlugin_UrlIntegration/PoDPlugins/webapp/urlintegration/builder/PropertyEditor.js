sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "dm.custom.ext.dynamic.urlintegration.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			
			this.setI18nKeyPrefix("customComponentListConfig.");
			this.setResourceBundleName("dm.custom.ext.dynamic.urlintegration.i18n.builder");
			this.setPluginResourceBundleName("dm.custom.ext.dynamic.urlintegration.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
			
			oFormContainer = oPropertyFormContainer;
			
			this.addInputField(oPropertyFormContainer, "Text", oData);
			this.addInputField(oPropertyFormContainer, "LogoUrl", oData);
			
			this.addInputField(oPropertyFormContainer, "Url", oData);
			
			this.addInputField(oPropertyFormContainer, "Param1Key", oData);
			this.addInputField(oPropertyFormContainer, "Param1Value", oData);
			
			this.addInputField(oPropertyFormContainer, "Param2Key", oData);
			this.addInputField(oPropertyFormContainer, "Param2Value", oData);
			
		},
		
		getDefaultPropertyData: function(){
			return {

			};
		}

	});
});