# POD 2.0 Custom Extension Showcase

A reference guide for all custom widgets, actions, and patterns in this extension package.

---

## Packaging & Deployment

Run the `/pod2-extension-package` skill from Claude Code to build a deployment-ready zip and get the exact values to paste into the **Manage POD 2.0 → Extensions** upload dialog:

```
/pod2-extension-package
```

The skill will:
1. Locate the `custom-pod2-examples` directory automatically (works from any CWD, Mac and Windows)
2. Delete any previously built zip
3. Create `custom-pod2-extension.zip` (excludes `.claude/` and macOS metadata)
4. Print the zip path and size
5. Print the upload values — Name, Description, Namespace, Source Code — ready to copy into the dialog

---

## Widgets

### 1. Equipment History (`EquipmentHistory.js`)

**Purpose:** Displays the last N equipment (resource) usage records for the current work center, showing which materials, orders, and SFCs ran on the resource and when.

**Key behaviour:**
- Automatically reacts to resource filter changes via `PodContext.subscribe(ModelPath.FilterResources)`
- Fetches records from the MDO API using `MdoEnhancedClient` with plant + resource filters
- Page size is fixed at **50 records** (hardcoded constant `DEFAULT_PAGE_SIZE`)

**POD Designer configuration:** None — no configurable properties. Page size cannot be changed at design time.

**Columns:** Material · Order · SFC · SFC Status · Started At · Completed At

**Extends:** `sap.dm.dme.pod2.widget.core.TableWidget`

---

### 2. Enhanced Data Collection Table (`EnhancedDataCollectionTable.js`)

**Purpose:** Extends the standard Data Collection Groups table to show the **last collected value** alongside each parameter, giving operators immediate visibility into the most recent measurement without opening the data collection dialog.

**Key behaviour:**
- Inherits all standard data collection behaviour (group display, parameter list, collection workflow)
- Adds a `Last Collected Value` column populated by fetching the latest submission per parameter from the execution API
- Adds a Refresh button in the toolbar to reload last-collected values on demand

**POD Designer configuration:** None — no additional configurable properties beyond those inherited from `DataCollectionGroupTableWidget`.

**New field:** `LastCollectedValue` — rendered as an `ObjectStatus` (green = collected, neutral = none)

**Extends:** `sap.dm.dme.pod2.datacollection.widget.DataCollectionGroupTableWidget`

---

### 3. Component Verification (`ComponentVerification.js`)

**Purpose:** Extends the standard Component Consumption List to add an inline **Verify** button per component row and a toolbar-level **Validate** button. Used in assembly operations where components must be verified against an external system before being consumed.

**Key behaviour:**
- Each row gets a Verify button; pressing it sets the selected component in `ConsumptionContext` and opens a configurable verification dialog
- A Validate button in the toolbar fires the `validate` event, which can be wired to any action in the POD Designer
- Dialog to open is configured per instance via the Verify Plugin ID property

**POD Designer configuration:**

| Property | Description | Required |
|---|---|---|
| **Verify Plugin ID** | Plugin or dialog ID to open when the Verify button is pressed on a row | Yes |

> Inherited properties from `ComponentConsumptionListWidget` are also available.

**Events (POD Designer wiring):**

| Event ID | Display Name | Fired when |
|---|---|---|
| `validate` | Validate (i18n: `ComponentVerification.validateButton`) | Toolbar Validate button is pressed |

> Inherited events from `ComponentConsumptionListWidget` are also wired in the designer.

**Extends:** `sap.dm.dme.pod2.sfccomponents.consumption.widget.ComponentConsumptionListWidget`

---

### 4. Work Center Selection Widget (`WorkCenterSelectionWidget.js`)

**Purpose:** Renders a labelled dropdown whose items are populated at runtime from a configurable custom field on the active Workcenter. The custom field holds a comma-separated list of valid values (e.g. `"Option A,Option B,Option C"`). When the operator picks a value it is written to `PodContext` at `/custom/workcenterSelection` so any other widget can react to it.

**Key behaviour:**
- Subscribes to `ModelPath.FilterWorkCenters` — reloads items automatically whenever the POD work center filter changes
- Calls `WorkCenterPublicApiClient.getWorkCenters({ plant, workCenter })` using the plant and first work center from the POD filter
- Locates the `customValues` entry whose `attribute` matches the **Custom Field Key** property, splits its `value` by commas, and populates the `sap.m.Select`
- On selection change, writes the selected key string to `PodContext` at `/custom/workcenterSelection`
- Other widgets subscribe to `/custom/workcenterSelection` via `PodContext.subscribe` or read it with `PodContext.get` to respond to the operator's choice

**POD Designer configuration:**

| Property | Category | Description | Default |
|---|---|---|---|
| **Custom Field Key** | Data | The `attribute` name of the Workcenter custom field that holds the comma-separated values (e.g. `selectionOptions`) | _(empty)_ |
| **Label** | Appearance | Text displayed above the dropdown | `Selection` |
| **Width** | Dimension | CSS width of the widget (e.g. `200px`, `50%`, `15rem`) | `100%` |
| **Height** | Dimension | CSS height of the widget (e.g. `80px`, `auto`) | `auto` |

**Inter-plugin wiring example:**

```js
// Any other widget that should react to the operator's selection:
PodContext.subscribe("/custom/workcenterSelection", (sValue) => {
    // sValue is the selected item key
}, this);
```

**Extends:** `sap.dm.dme.pod2.widget.Widget`

---

## Actions

### 5. External Data Fetch Action (`ExternalDataFetchAction.js`)

**Display name:** Fetch REST Data

**Purpose:** Fetches data from an external REST endpoint (via a configured BTP destination) and stores the response in the POD Context model at a configurable path. Other plugins subscribe to that path and react when the data arrives.

**Key behaviour:**
- Supports GET and POST; POST accepts a configurable JSON payload
- Security controls: path traversal detection, internal address blocking, 30 s timeout
- Destination is optional — when omitted the URL is called directly; when provided the request is routed through `/destination/<name>/<path>`
- Response is written to the POD Context via `PodContext.set("/" + outputPath, response)`
- Any plugin subscribed to that path reacts automatically

**POD Designer configuration:**

| Property | Description | Required | Default |
|---|---|---|---|
| **Destination** | BTP destination name to route the request through (optional) | No | — |
| **HTTP Method** | `GET` or `POST` | Yes | `POST` |
| **Data URL** | Relative URL path to call on the destination (or full path when no destination) | Yes | — |
| **Input Payload** | JSON body sent with POST requests | Only for POST | — |
| **Output Data Context** | POD Context path where the response is stored (alphanumeric and `/` only, e.g. `external/myData`) | Yes | — |

> **Input Payload** is only shown in the POD Designer when **HTTP Method** is set to `POST`.

> **Output Data Context** accepts alphanumeric characters and `/` only. The leading `/` is added automatically — do not include it in the property value.

**Extends:** `sap.dm.dme.pod2.action.Action`

---

### 6. Server Notification Handler Action (`ServerNotificationHandlerAction.js`)

**Display name:** Server Notification Handler

**Purpose:** Subscribes to the POD WebSocket notification bus for `EventType.CUSTOM` (generic server-push) messages, stores the payload in the POD Context, and adds a rich inline card to the Message History for each notification received.

**Key behaviour:**
- Hardcoded to `EventType.CUSTOM` (`sap.dsc.dm.GENERIC.MESSAGE.v1`) — the generic server-push channel
- Subscription is created once on the first `execute()` call and stays active for the session
- Subscription filter is scoped to the current plant + first work center from the POD filter
- Payload is written to `PodContext.set(contextPath, payload.data ?? payload)`
- Each received notification is pushed to the Message History as a distinct entry:
  - **Title:** `<eventType> — <eventId>` (e.g. `CUSTOM — abc-123`) — unique per message so every notification stacks independently
  - **Card body:** all key-value pairs from `message.data`, rendered as bold-label / value rows inline in the message list
  - Handles late-loaded extension scenario: initialises the message history array if it has not been set yet by the framework

**POD Designer configuration:**

| Property | Description | Required |
|---|---|---|
| **Context Path** | POD Context model path where the notification payload is stored (e.g. `/serverNotification/custom`) | Yes |

**Message History card layout:**
```
ℹ  CUSTOM — abc-123
   plant:       PLANT1
   workCenter:  WC-01
   …
```

**Extends:** `sap.dm.dme.pod2.action.Action`

**Framework dependency:** Requires the updated `MessageHistoryWidget` (in `dme-podfoundation-ui`) which uses a factory-based list binding to render inline key-value cards for messages whose `description` is a JSON object.

---

## Utilities

### 7. MDO Enhanced Client (`client/MdoEnhancedClient.js`)

**Purpose:** Wrapper around the standard MDO API client with added input validation — rejects filter values that are empty, contain illegal characters, or exceed the maximum allowed length. Used by `EquipmentHistory` to safely query MDO data.

**Validation guards:**
- Filter value must not be empty
- Must not contain illegal characters
- Must not exceed the maximum length

---

## Inter-Plugin Communication Patterns

### Pattern A — Widget Events + Actions (POD Designer wiring)

A plugin declares events in `getEvents()` and fires them with `this._handleEvent(eventId, oEvent)`. In the POD Designer the operator wires any event on any widget to a chain of actions — including standard actions (`RefreshWorkListAction`) or custom actions (`ServerNotificationHandlerAction`).

```
Custom Plugin
  ↓ _handleEvent("validate", oEvent)
POD Designer wiring
  ↓ executes action chain
Standard Action (e.g. RefreshWorkListAction)
  ↓ WorkListDelegate.refresh()
WorkList Widget reloads
```

**Direction:** any plugin → any action, configured at design time.

---

### Pattern B — PodContext Model Subscriptions (runtime reactive)

A plugin writes to a shared model path; any other plugin subscribed to that path is notified immediately.

```js
// Publisher (any plugin or action)
PodContext.set("/myExtension/result", oData);

// Subscriber (any other plugin)
PodContext.subscribe("/myExtension/result", (oData) => {
    // react to new data
}, this);
```

Standard shared paths are defined in `ModelPath`. Custom extensions can use any path under a private namespace (e.g. `/myExtension/...`).

**Direction:** any plugin → any plugin, no design-time configuration required.

---

### Pattern C — Triggering Standard Plugin Refresh

| Approach | How | When to use |
|---|---|---|
| POD Designer wiring | Wire custom event → `RefreshWorkListAction` or `RefreshOperationActivitiesAction` | Simple refresh after a button press |
| PodContext path write | `PodContext.setSelectedOperationActivities([...])` or other setter | React to data changes |
| Direct Delegate call | Import `WorkListDelegate` / `OperationActivityDelegate`, call `.refresh()` | Refresh as part of a larger action sequence |

---

## Extension Registration (`extension.json`)

```json
{
    "widgets": [
        { "modulePath": "custom/pod2/example/plugins/basic",                       "type": "custom.pod2.example.plugins.basic" },
        { "modulePath": "custom/pod2/example/plugins/ComponentVerification",       "type": "custom.pod2.example.plugins.ComponentVerification" },
        { "modulePath": "custom/pod2/example/plugins/EquipmentHistory",            "type": "custom.pod2.example.plugins.EquipmentHistory" },
        { "modulePath": "custom/pod2/example/plugins/EnhancedDataCollectionTable", "type": "custom.pod2.example.plugins.EnhancedDataCollectionTable" },
        { "modulePath": "custom/pod2/example/plugins/WorkCenterSelectionWidget",   "type": "custom.pod2.example.plugins.WorkCenterSelectionWidget",
          "name": "Work Center Selection", "description": "Dropdown populated from a Workcenter custom field (comma-separated values). Writes the selected value to PodContext at /custom/workcenterSelection." }
    ],
    "actions": [
        { "modulePath": "custom/pod2/example/actions/ExternalDataFetchAction",          "type": "custom.pod2.example.actions.ExternalDataFetchAction" },
        { "modulePath": "custom/pod2/example/actions/ServerNotificationHandlerAction",  "type": "custom.pod2.example.actions.ServerNotificationHandlerAction" }
    ]
}
```
