sap.ui.define([
    "sap/ui/model/resource/ResourceModel",
    "sap/dm/dme/podfoundation/control/PropertyEditor"
], function (ResourceModel, PropertyEditor) {
    "use strict";
    
    var oFormContainer;

    return PropertyEditor.extend( "huka.custom.plugin.whereUsedPlugin.whereUsedPlugin.builder.PropertyEditor" ,{

		constructor: function(sId, mSettings){
			PropertyEditor.apply(this, arguments);
			
			this.setI18nKeyPrefix("customPluginConfig.");
			this.setResourceBundleName("huka.custom.plugin.whereUsedPlugin.whereUsedPlugin.i18n.builder");
			this.setPluginResourceBundleName("huka.custom.plugin.whereUsedPlugin.whereUsedPlugin.i18n.i18n");
		},
		
		addPropertyEditorContent: function(oPropertyFormContainer){
			var oData = this.getPropertyData();
			
			this.addSwitch(oPropertyFormContainer, "custom_backButtonVisible", oData);
			this.addSwitch(oPropertyFormContainer, "custom_closeButtonVisible", oData);						
			this.addInputField(oPropertyFormContainer, "custom_title", oData);
			this.addInputField(oPropertyFormContainer, "custom_text", oData);
			this.addInputField(oPropertyFormContainer, "custom_whereUsedPPD", oData);
            oFormContainer = oPropertyFormContainer;
		},
		
		getDefaultPropertyData: function(){
			return {
				
				"custom_backButtonVisible": true,
				"custom_closeButtonVisible": true,
                "custom_title": "whereUsedPlugin",
				"custom_text": "whereUsedPlugin",
                "custom_whereUsedPPD": "whereUsedPlugin"
			};
		}

	});
});