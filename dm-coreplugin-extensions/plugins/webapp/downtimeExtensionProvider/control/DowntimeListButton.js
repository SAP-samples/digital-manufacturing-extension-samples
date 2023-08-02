sap.ui.define([
    "sap/dm/dme/podfoundation/control/ConfigurableButton"
], function(ConfigurableButton) {
    "use strict";

    let DowntimeListButton = ConfigurableButton.extend("sap.example.plugins.downtimeExtensionProvider.control.DowntimeListButton", {
        renderer: {}
    });

    DowntimeListButton.prototype._setBaseProperties = function(oButton, oButtonInner, sHeight) {
        ConfigurableButton.prototype._setBaseProperties.apply(this, arguments);
        // default vertical alignment works, but when configured it needs adjusting
        if (sHeight) {
            oButton.css("margin-bottom", "6px");
        }
    };

    return DowntimeListButton;
});
