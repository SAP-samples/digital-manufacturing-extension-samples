sap.ui.define([

    "sap/dm/dme/pod2/action/Action",
    "sap/dm/dme/pod2/model/I18nResourceModel"
],
    (
        Action,
        I18nResourceModel
    ) => {
        "use strict";

        class TranslationAction extends Action {

            static #oI18nModel = new I18nResourceModel("custom/pod2/global/i18n/i18n");

            static getI18nModel() {
                return this.#oI18nModel;
            }

            static getDisplayName() {
                return this.getI18nText("TranslationAction.DisplayName");
            }

            static getDescription() {
                return this.getI18nText("TranslationAction.Description");
            }

            async execute(oActionContext) {
                let i18nCustomModel = TranslationAction.getI18nModel();
                this.getPodRuntime().getView().setModel(i18nCustomModel, "i18nCustom");
            }

        }
        return TranslationAction;
    });