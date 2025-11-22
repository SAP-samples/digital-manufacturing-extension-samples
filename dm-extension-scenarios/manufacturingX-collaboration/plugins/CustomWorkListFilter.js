sap.ui.define([
    "sap/dm/dme/pod2/widget/worklist/WorkListFilterBarWidget",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
],

(
    WorkListFilterBarWidget,
    PodContext,
    I18nResourceModel,
    Fragment,
    JSONModel
) => {
    "use strict";

 
    class CustomWorkListFilter extends WorkListFilterBarWidget {

        static #oI18nModel = new I18nResourceModel("custom/pod2/example/plugins/i18n/i18n");

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "Custom Work List Filter";
        }
        
        static getCategory() {
            return "Manufacturing-X";
        }

        _createView(){
            let oFilterBar = super._createView();

            Fragment.load({
                name: "custom.pod2.example.plugins.SpecialComponentFilter",
                controller: this
            }).then(function(oFilterGroupItem){
                let statusModel = new JSONModel({
                    ComponentStatus: [
                        {
                            "key": "UNKNOWN",
                            "value": "Unknown"
                        },
                        {
                            "key": "IN_TRANSIT",
                            "value": "In Transit"
                        },
                        {
                            "key": "IN_TESTING",
                            "value": "In Testing"
                        }
                    ]
                })
                oFilterGroupItem.setModel(statusModel, "statusModel");

                oFilterBar.addFilterGroupItem(oFilterGroupItem);
            });
        
            
            return oFilterBar;
        }

        onSelectionChange(oEvent){

            if(oEvent.getSource().getSelectedItems().length){
                PodContext.set("/filter/componentStatus", oEvent.getSource().getSelectedItems()[0].getText())
            }
            
        }
        
        onInit() {
            super.onInit();
            if (PodContext.isRunMode()) {

            }
        }

        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
            
            }
        }

    
        
    }

    return CustomWorkListFilter;
});