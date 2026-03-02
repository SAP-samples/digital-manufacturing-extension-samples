# SAP Digital Manufacturing POD Plugin Extensions

Sample implementations for building custom POD (Production Operator Dashboard) plugins for SAP Digital Manufacturing, covering both POD 1.0 and POD 2.0 architectures.

## Quick Navigation

- [Architecture Comparison](#architecture-comparison)
- [POD 1.0](#pod-10)
- [POD 2.0](#pod-20)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Resources](#resources)

---

## Architecture Comparison

| Aspect | POD 1.0 | POD 2.0 |
|--------|---------|---------|
| **Architecture** | Full UI5 MVC Component | Lightweight ES6+ Classes |
| **Base Class** | `ProductionUIComponent` | `sap/dm/dme/pod2/widget/Widget` |
| **Files Required** | Component, Manifest, Controller, View, PropertyEditor | Single JavaScript file |
| **Registration** | `designer/components.json` | `extension.json` |
| **Complexity** | High | Low |
| **Performance** | Standard | Optimized |
| **Development Speed** | Slower | Faster |

**Recommendation:** Use POD 2.0 for new development.

---

## POD 1.0

### Examples (`custom-pod1-examples/`)

| Plugin | Purpose |
|--------|---------|
| **exampleView** | Display POD selection data and notifications |
| **exampleExecution** | Interactive operator interface |
| **exampleWip** | WIP visualization with D3.js network graphs |
| **scanAssembly** | Component scanning and tracking |
| **assemblyStatus** | Assembly status display |
| **customScrapConfirmation** | Enhanced scrap confirmation |
| **collectiveOrder** | Batch order management |
| **urlIntegration** | External URL/application integration |

### Structure

```
plugin-name/
├── Component.js              # Extends ProductionUIComponent
├── manifest.json             # App descriptor
├── builder/
│   └── PropertyEditor.js     # Configuration UI
├── controller/
│   └── *.controller.js       # Business logic
├── view/
│   └── *.view.xml           # UI definition
├── i18n/
│   └── *.properties         # Translations
└── css/
    └── style.css            # Styling
```

### Registration (`designer/components.json`)

```json
{
  "components": [{
    "id": "pluginId",
    "type": "VIEW_PLUGIN",
    "allowMultipleInstances": true,
    "name": "namespace.pluginName",
    "propertyEditor": "namespace.pluginName.builder.PropertyEditor",
    "i18n": "namespace.pluginName.i18n.i18n",
    "supportedPodTypes": ["WORK_CENTER","OPERATION","ORDER","OTHER","MONITOR"]
  }]
}
```

---

## POD 2.0

### Examples (`custom-pod2-examples/`)

**Plugins:**
- `basic.js` - Minimal implementation example with simple UI controls
- `ComponentVerification.js` - Component verification with custom verify button
- `EquipmentHistory.js` - Equipment usage history (last 50 records) with date formatting
- `EnhancedDataCollectionTable.js` - Data collection table with last collected values

**Actions:**
- `ExternalDataFetchAction.js` - Configurable REST API calls (GET/POST) with BTP destination support

### Structure

```
extension-name/
├── extension.json           # Registry
├── plugins/
│   └── *.js                # Plugin implementations
├── actions/
│   └── *.js                # Reusable actions
├── client/
│   └── *.js                # Custom API clients
├── fragments/
│   └── *.xml               # UI fragments
└── i18n/
    └── *.properties        # Translations
```

### Plugin Implementation

```javascript
sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor"
], (Widget, WidgetProperty, BooleanPropertyEditor) => {
    
    class MyPlugin extends Widget {
        static getDisplayName() { return "My Plugin"; }
        static getIcon() { return "sap-icon://wrench"; }
        static getCategory() { return "Custom"; }
        
        _createView() {
            return new sap.m.VBox({
                items: [/* UI controls */]
            });
        }
        
        getProperties() {
            return [
                new WidgetProperty({
                    propertyEditor: new BooleanPropertyEditor(this, "myProperty", true)
                })
            ];
        }
    }
    
    return MyPlugin;
});
```

### Registration (`extension.json`)

```json
{
    "widgets": [{
        "modulePath": "<namespace>/plugins/<PluginName>",
        "type": "<namespace>.plugins.<PluginName>"
    }],
    "actions": [{
        "modulePath": "<namespace>/actions/<ActionName>",
        "type": "<namespace>.actions.<ActionName>"
    }]
}
```

**Note:** Plugins are registered in the `widgets` array. The `type` must match `modulePath` with slashes replaced by dots.

---

## Deployment

### POD 1.0

1. Compress `custom-pod1-examples/` contents (root should be `/`)
2. Ensure `designer/components.json` is at root
3. Upload to **POD Designer** in SAP DM
4. Configure in POD

### POD 2.0

1. Compress `custom-pod2-examples/` contents (root should be `/`)
2. Ensure `extension.json` is at root
3. Upload to **Manage PODs 2.0** app
4. Specify Extension Name and Namespace
5. Configure in POD 2.0

**Best Practices:**
- Use version control (Git)
- Test in development before production
- Use consistent naming conventions
- Document functionality and dependencies
- Maintain backup copies

---

## API Reference

### POD 1.0

| Operation | Code |
|-----------|------|
| Get User ID | `this.getPodController().getUserId()` |
| Get Plant | `this.getPodController().getUserPlant()` |
| Get Selected SFC | `this.getPodController().getSelectionModel().getSfc()` |
| Get Selected Operation | `this.getPodController().getSelectionModel().getOperation()` |
| Get Work Center | `this.getPodController().getSelectionModel().getWorkCenter()` |
| Call DM API | `this.getPublicApiRestDataSourceUri() + '/path'` |
| Get i18n Text | `this.getI18nText(key)` |
| Publish Event | `this.publish("EventName", data)` |
| Subscribe Event | `this.subscribe("EventName", handler, this)` |
| Get Config | `this.getConfiguration().getProperty()` |

### POD 2.0

| Operation | Code |
|-----------|------|
| Get Plant | `PodContext.getPlant()` |
| Get User ID | `PodContext.getUserId()` |
| Get Filter Resources | `PodContext.getFilterResources()` |
| Get Filter Work Centers | `PodContext.getFilterWorkCenters()` |
| Get Selected Items | `PodContext.getSelectedWorkListItems()` |
| Subscribe to Changes | `PodContext.subscribe(ModelPath.FilterResources, handler, this)` |
| Unsubscribe | `PodContext.unsubscribe(ModelPath.FilterResources, handler, this)` |
| Get Property Value | `this.getPropertyValue('propertyName')` |
| Get i18n Text | `this.getI18nText(key)` |
| Show Dialog | `this.getPodRuntime().showDialog(dialogId)` |

---

## Resources

- [POD Plugins Developer Guide](https://help.sap.com/docs/sap-digital-manufacturing/pod-plugin-developer-s-guide/introduction)
- [Building Custom POD Plugins Blog](https://community.sap.com/t5/supply-chain-management-blog-posts-by-sap/building-a-custom-digital-manufacturing-pod-plugin-the-new-easy-way/ba-p/14161535)
- [SAP UI5 Documentation](https://sapui5.hana.ondemand.com/)
- [DM API Reference](https://api.sap.com/package/SAPDigitalManufacturingCloud)

---

## License

Copyright © 2020 SAP SE or an SAP affiliate company. All rights reserved.  
Licensed under the Apache Software License, v2.0.