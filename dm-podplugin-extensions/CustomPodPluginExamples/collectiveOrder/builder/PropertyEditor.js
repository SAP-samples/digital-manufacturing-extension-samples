sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "sap.ext.exampleplugins.collectiveOrder.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			this.setI18nKeyPrefix("customComponentListConfig.");
			this.setResourceBundleName("sap.ext.exampleplugins.collectiveOrder.i18n.builder");
			this.setPluginResourceBundleName("sap.ext.exampleplugins.collectiveOrder.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
			this.addInputField(oPropertyFormContainer, "title", oData);
			this.addInputField(oPropertyFormContainer, "text", oData);
            oFormContainer = oPropertyFormContainer;
		},
		
		getDefaultPropertyData: function(){
			return {
                "title": "co_plugin",
				"text": "co_plugin"
			};
		}
	});
});