sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "sap.custom.plugins.integrationextension.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			
			this.setI18nKeyPrefix("customComponentListConfig.");
			this.setResourceBundleName("sap.custom.plugins.integrationextension.i18n.builder");
			this.setPluginResourceBundleName("sap.custom.plugins.integrationextension.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
			
			oFormContainer = oPropertyFormContainer;
			
			this.addInputField(oPropertyFormContainer, "ApplicationUrl", oData);
			this.addInputField(oPropertyFormContainer, "PeronnelInfoPath", oData);
            this.addInputField(oPropertyFormContainer, "ExecutionPath", oData);
            this.addInputField(oPropertyFormContainer, "SalesOrderField", oData);
			
		},
		
		getDefaultPropertyData: function(){
			return {
				"tableConfiguration" : {
					alternateRowColors : true,
					fixedLayout : false,
					stickyHeader : true 
				} 
			};
		}

	});
});