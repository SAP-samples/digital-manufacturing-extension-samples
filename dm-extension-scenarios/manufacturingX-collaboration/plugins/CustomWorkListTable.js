sap.ui.define([
    "sap/m/Text",
    "sap/dm/dme/pod2/widget/worklist/WorkListTableWidget",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/model/I18nResourceModel",
    "sap/m/ObjectStatus"
],

(
    Text,
    WorkListTableWidget,
    ModelPath,
    PodContext,
    I18nResourceModel,
    ObjectStatus
) => {
    "use strict";

    
    class CustomWorkListTable extends WorkListTableWidget {


        static #oI18nModel = new I18nResourceModel("custom/pod2/example/plugins/i18n/i18n");

        static getI18nModel() {
            return this.#oI18nModel;
        }

        static getDisplayName() {
            return "Custom Work List Table";
        }

        static getCategory() {
            return "Manufacturing-X";
        }

        _getComponentStatus(){
            let specialComponentStatus = {
                    UNKNOWN: 'Unknown',
                    IN_TRANSIT: 'In Transit',
                    IN_TESTING: 'In Testing'
            };

            let specialComponentStatus_values = Object.values(specialComponentStatus); 
            let randomIndex = Math.floor(Math.random() * specialComponentStatus_values.length);
            let randomEnumValue = specialComponentStatus_values[randomIndex];
            return randomEnumValue;

        }

        onInit() {
            super.onInit();
            if (PodContext.isRunMode()) {
                PodContext.subscribe(
                    ModelPath.WorkListItems,
                    this._fetchAdditionalData,
                    this
                );
                
            }
        }

        /* 
            Data is locally simulated, TBD
        */

        _fetchAdditionalData() {
            if(PodContext.getWorkListItems().length){
                
                let worklist = PodContext.getWorkListItems();
                let i=0;
                for(i=0;i<worklist.length;i++){
                    worklist[i].specialComponentStatus = PodContext.get("/filter/componentStatus") ? PodContext.get("/filter/componentStatus") : this._getComponentStatus();
                }   
                PodContext.getModel().refresh();
            }
            
        }

        
        onExit() {
            super.onExit();
            if (PodContext.isRunMode()) {
                PodContext.unsubscribe(ModelPath.WorkListItems, this._fetchAdditionalData, this);
            }
        }

        
        static getFields() {
            const thisI18n = this.getI18nText.bind(this);
            return [
                ...super.getFields(),
                {
                    field: "sfcQuantityInWork",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("CustomWorkListTable.sfcQuantityInWork"),
                    width: "150px"
                },
                {
                    field: "specialComponentStatus",
                    importance: "High",
                    sortable: false,
                    text: thisI18n("CustomWorkListTable.specialComponentStatus"),
                    width: "150px"
                }
            ]
        }

        _createCell(oColumnConfig) {
            
            if (oColumnConfig.field === "specialComponentStatus") {
                
                return new ObjectStatus({
                    state: "Information",
                    text: "{specialComponentStatus}"
                });
            } else if (oColumnConfig.field === "sfcQuantityInWork") {
                return new Text({
                    wrapping: true,
                    text: "{sfcQuantityInWork}"
                });
            } else {
                return super._createCell(oColumnConfig);
            }
        }

        
    }

    return CustomWorkListTable;
});