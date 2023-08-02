sap.ui.define([
    "sap/dm/dme/podfoundation/control/ConfigurableButton"
], function(ConfigurableButton) {
    "use strict";

    let ConfigurableListButton = ConfigurableButton.extend("sap.example.plugins.resourceStatusExtensionProvider.control.ConfigurableListButton", {
        renderer: {}
    });

    ConfigurableListButton.prototype._setBaseProperties = function(oButton, oButtonInner, sHeight) {
        ConfigurableButton.prototype._setBaseProperties.apply(this, arguments);
        // default vertical alignment works, but when configured it needs adjusting
        if (sHeight) {
            oButton.css("margin-bottom", "6px");
        }
    };

    return ConfigurableListButton;
});
