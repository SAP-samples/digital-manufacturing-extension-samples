sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/sap/me/customOperationPOD/model/formatter",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/Viewer",
	"sap/m/PDFViewer",
	"sap/ui/core/HTML",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel",
	'sap/m/MessageBox',
	'sap/ui/core/Fragment',
	'sap/ui/core/Popup'
], function (Controller, formatter, ContentResource, Viewer, PDFViewer, HTML, MessageToast, ResourceModel, MessageBox, Fragment, Popup) {
	"use strict";
	var that;
	return Controller.extend("com.sap.me.customOperationPOD.controller.MainView", {
		formatter: formatter,
		aViewerSupportTypesV1_52: ["vds", "vdsl", "jpg"],
		aPicturesTypes: ["jpeg", "pjpeg", "png", "gif"],
		aStreamedTypes: ["vdsl", "vds", "pdf", "png", "jpeg", "jpg", "gif"],
		onInit: function () {
			that = this;
			that.documentHeight = $(document).height();
			//i18 Model
			var oResourceModel = new ResourceModel({
				bundleName: "com.sap.me.customOperationPOD.i18n.i18n"
			});
			this._oI18nResourceBundle = oResourceModel.getResourceBundle();

			//Initial Parameters Model - Loaded from URL
			this.parametersModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.parametersModel, "parametersModel");
			var paramData = {};
			paramData.Site = this._urlParam("SITE");
			paramData.Operation = this._urlParam("OPERATION");
			if (this._urlParam("VERSION")) {
				paramData.OperationVersion = this._urlParam("VERSION");
			} else {
				paramData.OperationVersion = "A";
			}
			paramData.Resource = this._urlParam("RESOURCE");
			this.parametersModel.setData(paramData);

			//Login and Heading Model
			this.loginModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.loginModel, "loginModel");

			this.headingModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.headingModel, "headingModel");
			var headingData = {};
			headingData.title = decodeURIComponent(this._urlParam("TITLE"));
			this.headingModel.setData(headingData);
			that._loadUserData();

			//View Model - Enable / Disable Controls
			this.viewModel = new sap.ui.model.json.JSONModel();
			this.viewModel.setSizeLimit(500);
			this.getView().setModel(this.viewModel, "viewModel");

			this.dcEvent = "";

			var viewData = {
				"Start": false,
				"SignOff": false,
				"Complete": false,
				"areDetailsVisible": true,
				"showNoAssyDataText": true,
				"showSerialVisible": false
			};
			this.viewModel.setData(viewData);

			//Model for Loading - Work List
			this.workListModel = new sap.ui.model.json.JSONModel();
			this.workListModel.setSizeLimit(500);
			this.getView().setModel(this.workListModel, "workListModel");

			//Model for Loading Characters
			this.charcterModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.charcterModel, "charcterModel");

			//Model for Loading Components
			this.componentModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.componentModel, "componentModel");

			//Model for Loading Work Instructions
			this.workInstructionModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.workInstructionModel, "workInstructionModel");

			//Model for Data Collection
			this.dataCollectionModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.dataCollectionModel, "dataCollectionModel");

			//Model for Assembly Component
			this.assemblyDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.assemblyDataModel, "assemblyDataModel");

			//Model for Data Collection - Value Help
			this.dataCollectionSuggestionModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.dataCollectionSuggestionModel, "dataCollectionSuggestionModel");

			that._openLoginDialog();

			//Model for Data Collection Parameters
			this.dataCollectionDetailModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.dataCollectionDetailModel, "dataCollectionDetailModel");

			//Model for Data Collection View
			this.dataCollectionViewModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.dataCollectionViewModel, "dataCollectionViewModel");
			var dataCollectionViewModelData = {
				"save": false
			};
			this.dataCollectionViewModel.setData(dataCollectionViewModelData);

			//Model for Comments
			this.commentModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.commentModel, "commentModel");

			//Operation Browse
			this.operationSuggestionModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.operationSuggestionModel, "operationSuggestionModel");

			//Resource Browse
			this.resourceSuggestionModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.resourceSuggestionModel, "resourceSuggestionModel");

			//Function to enable Keys
			this.setKeyboardShortcuts();
		},
		/*
		*********** Section for Login and User **************
		
		*****************************************************
		*/
		//Load User Data from JSP
		_loadUserData: function () {
			var UserData = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getComponentData();
			var data = that.headingModel.getData();
			data.User = UserData.UserFirst.substring(0, 1) + UserData.UserLast.substring(0, 1);
			data.UserName = UserData.UserID;
			that.headingModel.setData(data);
		},
		//Function to to Open Login Dialog Box
		_openLoginDialog: function () {
			if (that._oLoginDialog) {
				that._oLoginDialog.open();
			} else {
				Fragment.load({
					id: "resourceDialog",
					name: "com.sap.me.customOperationPOD.fragment.login",
					controller: this
				}).then(function (LoginDialog) {
					that._oLoginDialog = LoginDialog;
					that.getView().addDependent(this._oLoginDialog);
					that._oLoginDialog.open();
				}.bind(this));

			}
		},

		//Function to Check Login User and Get FORM_ID (Service for FORM_ID Works only with Basic Authentication)
		fnCheckUser: function () {
			var loginData = that.loginModel.getData();
			var url = '/manufacturing-rest/web-api/xsrf/generateFormId';
			if ((loginData.USERNAME !== "") && (loginData.PASSWORD !== "") && (loginData.USERNAME !== undefined) && (loginData.PASSWORD !==
					undefined)) {
				$.ajax({
					url: url,
					type: 'GET',
					beforeSend: function (xhr) {
						//xhr.setRequestHeader("Authorization", "Basic " + btoa("site_admin:Visiprise1"));
						xhr.setRequestHeader("Authorization", "Basic " + btoa(loginData.USERNAME + ":" + loginData.PASSWORD));
					},
					success: function (data) {
						that.formID = data.FORM_ID;
						that._loadWorkList();
						that._oLoginDialog.close();
					},
					error: function (error) {
						MessageToast.show(error.statusText, {
							duration: 500
						});
					}
				});
			} else {
				var msg = that._oI18nResourceBundle.getText("login.errorMessage");
				MessageToast.show(msg, {
					duration: 500
				});
			}
		},
		/*
		*********** Section for Theme Selection *************
		
		*****************************************************
		*/
		//Value Helper Menu for Theme
		handleThemeSelection: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._menu) {
				Fragment.load({
					name: "com.sap.me.customOperationPOD.fragment.themes",
					controller: this
				}).then(function (oMenu) {
					this._menu = oMenu;
					this.getView().addDependent(this._menu);
					this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
				}.bind(this));
			} else {
				this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
			}
		},
		//Selection of Theme
		handleTheme: function (oEvent) {
			var theme = oEvent.getParameter("item").getText();
			switch (theme) {
			case "SAP Quartz":
				sap.ui.getCore().applyTheme("sap_fiori_3");
				break;
			case "SAP Quartz Dark":
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
				break;
			case "SAP Belize plus":
				sap.ui.getCore().applyTheme("sap_belize_plus");
				break;
			}
		},
		/*
		*********** Section for Filter Bar *************
		
		************************************************
		*/
		//Open Operation Dialog
		showOperationDialog: function (oEvent) {
			that.operationInput = oEvent.getSource();
			if (!that._oOperationDialog) {
				Fragment.load({
					id: "operationDialog",
					name: "com.sap.me.customOperationPOD.fragment.OperationBrowse",
					controller: this
				}).then(function (OperationDialog) {
					this._oOperationDialog = OperationDialog;
					this.getView().addDependent(this._oOperationDialog);
				}.bind(this));
			}
			var param = {
				"operation": "",
				"revision": ""
			};
			var url = "/manufacturing-rest/web-api/OperationConfigurationServiceRPC/findOperationsByKeyFieldMask?Site=" +
				this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (dataout) {
					that.operationSuggestionModel.setData(dataout);
					that._oOperationDialog.open();
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//Resource Browse
		showResourceDialog: function (oEvent) {
			that.resourceInput = oEvent.getSource();
			if (!that._oResourceDialog) {
				Fragment.load({
					id: "resourceDialog",
					name: "com.sap.me.customOperationPOD.fragment.ResourceBrowse",
					controller: this
				}).then(function (ResourceDialog) {
					this._oResourceDialog = ResourceDialog;
					this.getView().addDependent(this._oResourceDialog);
				}.bind(this));
			}
			var param = {
				"resource": "*"
			};
			var url = "/manufacturing-rest/web-api/ResourceConfigurationServiceRPC/findResourcesByNameMask?Site=" +
				this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (dataout) {
					that.resourceSuggestionModel.setData(dataout);
					that._oResourceDialog.open();
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//On Operation Selection
		onSelectOperation: function (oEvent) {
			var paramData = that.parametersModel.getData();
			paramData.Operation = oEvent.getSource().getSelectedItem().getBindingContext("operationSuggestionModel").getObject().operation;
			paramData.OperationVersion = oEvent.getSource().getSelectedItem().getBindingContext("operationSuggestionModel").getObject().revision;
			that.parametersModel.setData(paramData);
			that._oOperationDialog.close();
			that._loadWorkList();
		},
		//On Resource Selection
		onSelectResource: function (oEvent) {
			var paramData = that.parametersModel.getData();
			paramData.Resource = oEvent.getSource().getSelectedItem().getBindingContext("resourceSuggestionModel").getObject().resource;
			that.parametersModel.setData(paramData);
			that._oResourceDialog.close();
			that._loadWorkList();
		},
		//On Operation Filter Dialog Cancel
		onOperationFilterCancel: function () {
			that._oOperationDialog.close();
		},
		//On Resource Filter Dialog Cancel
		onResourceFilterCancel: function () {
			that._oResourceDialog.close();
		},
		//On Operation Filter Change
		onOperationLiveChange: function (oEvent) {
			that.fnClearFilterBar();
			var aFilters = [];
			if (Fragment.byId("operationDialog", "operationSearchField").getValue() !== "") {
				aFilters[aFilters.length] = new sap.ui.model.Filter("operation", sap.ui.model.FilterOperator.Contains, Fragment.byId(
					"operationDialog",
					"operationSearchField").getValue());
				aFilters[aFilters.length] = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, Fragment.byId(
					"operationDialog",
					"operationSearchField").getValue());
				var oFilter = new sap.ui.model.Filter({
					and: false,
					filters: aFilters
				});
			}

			Fragment.byId("operationDialog", "operationResultTable").getBinding("items").filter(oFilter);
		},
		//On Resource Filter Change
		onResourceLiveChange: function (oEvent) {
			that.fnClearFilterBarResource();
			var aFilters = [];
			if (Fragment.byId("resourceDialog", "resourceSearchField").getValue() !== "") {
				aFilters[aFilters.length] = new sap.ui.model.Filter("resource", sap.ui.model.FilterOperator.Contains, Fragment.byId(
					"resourceDialog",
					"resourceSearchField").getValue());
				aFilters[aFilters.length] = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, Fragment.byId(
					"resourceDialog",
					"resourceSearchField").getValue());
				var oFilter = new sap.ui.model.Filter({
					and: false,
					filters: aFilters
				});
			}

			Fragment.byId("resourceDialog", "resourceResultTable").getBinding("items").filter(oFilter);
		},
		//On Operation Filter Bar Value Change
		onOperationFilterBarChange: function (oEvent) {
			Fragment.byId("operationDialog", "operationSearchField").setValue("");
			var aFilters = [];
			var count = 0;
			if (Fragment.byId("operationDialog", "operationFilter").getValue() !== "") {
				aFilters[count] = new sap.ui.model.Filter("operation", sap.ui.model.FilterOperator.Contains, Fragment.byId("operationDialog",
					"operationFilter").getValue());
				count = count + 1;
			}
			if (Fragment.byId("operationDialog", "descriptionFilter").getValue() !== "") {
				aFilters[count] = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, Fragment.byId("operationDialog",
					"descriptionFilter").getValue());
				count = count + 1;
			}
			if (Fragment.byId("operationDialog", "statusFilter").getSelectedKey() !== "ALL") {
				aFilters[count] = new sap.ui.model.Filter("statusRef", sap.ui.model.FilterOperator.Contains, Fragment.byId("operationDialog",
					"statusFilter").getSelectedKey());
				count = count + 1;
			}
			if (count >= 1) {
				var oFilter = new sap.ui.model.Filter({
					and: false,
					filters: aFilters
				});
				Fragment.byId("operationDialog", "operationResultTable").getBinding("items").filter(oFilter);
			} else {
				Fragment.byId("operationDialog", "operationResultTable").getBinding("items").filter([]);
			}

		},
		//On Resource Filter Bar Value Change
		onResourceFilterBarChange: function (oEvent) {
			Fragment.byId("resourceDialog", "resourceSearchField").setValue("");
			var aFilters = [];
			var count = 0;
			if (Fragment.byId("resourceDialog", "resourceFilter").getValue() !== "") {
				aFilters[count] = new sap.ui.model.Filter("resource", sap.ui.model.FilterOperator.Contains, Fragment.byId("resourceDialog",
					"resourceFilter").getValue());
				count = count + 1;
			}
			if (Fragment.byId("resourceDialog", "descriptionFilter").getValue() !== "") {
				aFilters[count] = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, Fragment.byId("resourceDialog",
					"descriptionFilter").getValue());
				count = count + 1;
			}
			if (Fragment.byId("resourceDialog", "statusFilter").getSelectedKey() !== "ALL") {
				aFilters[count] = new sap.ui.model.Filter("statusRef", sap.ui.model.FilterOperator.Contains, Fragment.byId("resourceDialog",
					"statusFilter").getSelectedKey());
				count = count + 1;
			}
			if (count >= 1) {
				var oFilter = new sap.ui.model.Filter({
					and: false,
					filters: aFilters
				});
				Fragment.byId("resourceDialog", "resourceResultTable").getBinding("items").filter(oFilter);
			} else {
				Fragment.byId("resourceDialog", "resourceResultTable").getBinding("items").filter([]);
			}

		},
		//Filter Bar Clear - Operation
		fnClearFilterBar: function () {
			Fragment.byId("operationDialog", "operationFilter").setValue("");
			Fragment.byId("operationDialog", "descriptionFilter").setValue("");
			Fragment.byId("operationDialog", "statusFilter").setSelectedKey("ALL");

		},

		//Filter Bar Clear - Resource
		fnClearFilterBarResource: function () {
			Fragment.byId("resourceDialog", "resourceFilter").setValue("");
			Fragment.byId("resourceDialog", "descriptionFilter").setValue("");
			Fragment.byId("resourceDialog", "statusFilter").setSelectedKey("ALL");

		},
		//On Operation Filter Bar Clear
		onOperationFilterBarClear: function (oEvent) {
			that.fnClearFilterBar();
			Fragment.byId("operationDialog", "operationSearchField").setValue("");
			Fragment.byId("operationDialog", "operationResultTable").getBinding("items").filter([]);
		},
		//On Resource Filter Bar Clear
		onResourceFilterBarClear: function (oEvent) {
			that.fnClearFilterBarResource();
			Fragment.byId("resourceDialog", "resourceSearchField").setValue("");
			Fragment.byId("resourceDialog", "resourceResultTable").getBinding("items").filter([]);
		},
		/*
		*********** Section for Work List Plugin *************
		
		*****************************************************
		*/
		//Load Work List Data
		_loadWorkList: function () {
			var param = {
				"operationRef": "",
				"resourceRef": "",
				"listCategory": "",
				"listName": "",
				"mask": "",
				"site": ""
			};

			param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
				this.parametersModel.getData().OperationVersion;
			param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
			param.listCategory = "POD_WORKLIST";
			param.listName = "DEF_WORKLIST";
			param.site = this.parametersModel.getData().Site;

			var url = "/manufacturing-rest/web-api/pod/retrieveWorklist?FORM_ID=" + that.formID;

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.workListModel.setData(data);
					if (data.length > 0) {
						that.getView().byId("idWorkList").getItems()[0].setSelected(true);
						that.fnWorkListSelection();
					} else {
						that._clearData();
					}
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//Reload Work List Data
		_reLoadWorkList: function () {
			var param = {
				"operationRef": "",
				"resourceRef": "",
				"listCategory": "",
				"listName": "",
				"mask": "",
				"site": ""
			};

			param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
				this.parametersModel.getData().OperationVersion;
			param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
			param.listCategory = "POD_WORKLIST";
			param.listName = "DEF_WORKLIST";
			param.site = this.parametersModel.getData().Site;

			var url = "/manufacturing-rest/web-api/pod/retrieveWorklist?FORM_ID=" + that.formID;

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.workListModel.setData(data);
					that._updateActionEnabled();
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//On Work List Selection
		fnWorkListSelection: function () {
			that._loadFilterBarSFC();
			that._loadCharacterList();
			that._loadWorkInstruction();
			that._loadComponentList();
			that._updateActionEnabled();
			that._loadDataCollection();

		},
		//On Work List Clear
		_clearData: function () {
			that.parametersModel.setProperty("/sfc", "");
			that.charcterModel.setData([]);
			that.workInstructionModel.setData([]);
			that.componentModel.setData([]);

			var viewData = that.viewModel.getData();
			viewData.Start = false;
			viewData.SignOff = false;
			viewData.Complete = false;
			that.viewModel.setData(viewData);

			var dataCollectionViewModelData = that.dataCollectionViewModel.getData();
			that.dataCollectionModel.setData([]);
			dataCollectionViewModelData.save = false;
			that.dataCollectionDetailModel.setData(new Array());
			that.dataCollectionViewModel.setData(dataCollectionViewModelData);

			that.assemblyDataModel.setData({});
			that.viewModel.setProperty("/showNoAssyDataText", true);
			that.viewModel.setProperty("/showSerialVisible", false);

		},
		//Load SFC to Filter Bar on Work List Selection
		_loadFilterBarSFC: function () {
			var sfc = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().sfc;
			that.parametersModel.setProperty("/sfc", sfc);
		},
		//Change Action Status on Work List Selection
		_updateActionEnabled: function () {
			var statusCode = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().statusCode;
			var viewData = that.viewModel.getData();
			if (statusCode === "401") {
				viewData.Start = true;
				viewData.SignOff = false;
				viewData.Complete = false;
			} else if (statusCode === "402") {
				viewData.Start = true;
				viewData.SignOff = false;
				viewData.Complete = false;
			} else if (statusCode === "403") {
				viewData.Start = false;
				viewData.SignOff = true;
				viewData.Complete = true;
			} else {
				viewData.Start = false;
				viewData.SignOff = false;
				viewData.Complete = false;
			}
			that.viewModel.setData(viewData);
		},
		/*
		*********** Section for Assembly Plugin *************
		
		*****************************************************
		*/
		//Function to get Group for Assembly Compoent Display
		getGroup: function (code) {
			var notAssembledText = that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("label.notAssembled");
			var assembledText = that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("label.assembled");
			if (code.getObject().qtyRemaining > 0) {
				return notAssembledText;
			} else {
				return assembledText;
			}
		},
		_loadComponentList: function () {
			var param = {
				"site": "",
				"ComponentsListRequest": ""
			};
			var ComponentsListRequest = {
				"sfcSelectionList": "",
				"operationList": "",
				"substepList": [],
				"excludeCoProduct": false,
				"excludeByProduct": false
			};
			var operation = {
				"ref": ""
			};
			var sfcSelection = {
				"inputId": "",
				"sfc": "",
				"partialProcessLot": false
			};
			var sfc = {
				"sfcRef": "",
				"site": "",
				"sfc": ""
			};
			sfc.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().sfc;
			sfc.site = this.parametersModel.getData().Site;
			sfc.sfc = that.getView().byId("idWorkList").getSelectedItem().getBindingContext("workListModel").getObject().sfc;

			sfcSelection.inputId = that.getView().byId("idWorkList").getSelectedItem().getBindingContext("workListModel").getObject().sfc;
			sfcSelection.sfc = sfc;

			var sfcSelectionList = new Array(sfcSelection);

			operation.ref = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," + this.parametersModel
				.getData().OperationVersion;

			var operationList = new Array(operation);

			ComponentsListRequest.sfcSelectionList = sfcSelectionList;
			ComponentsListRequest.operationList = operationList;

			param.site = this.parametersModel.getData().Site;
			param.ComponentsListRequest = ComponentsListRequest;

			var url = "/manufacturing-rest/web-api/pod/getComponentList?FORM_ID=" + that.formID;

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.componentModel.setData(data);

					that.assemblyDataModel.setData({});
					that.viewModel.setProperty("/showNoAssyDataText", true);
					that.viewModel.setProperty("/showSerialVisible", false);

				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//On Click of Assemble
		assembleComponent: function (event) {
			that.assemblyDataModel.setData(event.getSource().getParent().getBindingContext("componentModel").getObject());
			var assyDataType = event.getSource().getParent().getBindingContext("componentModel").getObject().assyDataType;
			var bNoAssyData = event.getSource().getParent().getBindingContext("componentModel").getObject().assyDataType === "NONE";
			that.viewModel.setProperty("/showNoAssyDataText", bNoAssyData);
			that.viewModel.setProperty("/showSerialVisible", !bNoAssyData);
			if (!bNoAssyData) {
				that.viewModel.setProperty("/assemblyFieldDescription", that.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
					assyDataType));
			}
		},
		//Function to Add Component 
		onAddPress: function (event) {
			var assemblyData = that.assemblyDataModel.getData();
			if (assemblyData.qtyToAssemble) {

				var url = "/manufacturing-rest/web-api/AssemblyServiceRPC/assembleByComponents?Site=" +
					this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
				var param = {
					"event": "ADD_COMP",
					"operationRef": "",
					"resourceRef": "",
					"sfcRef": "",
					"componentList": ""
				};
				var component = {
					"actualComponentRef": "",
					"qty": "",
					"bomComponentRef": ""
				};
				var assemblyDataField = {
					"attribute": "",
					"value": "",
					"sequence": 0
				};

				param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
					this.parametersModel.getData().OperationVersion;
				param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
				param.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
					"workListModel").getObject().sfc;

				component.actualComponentRef = "ItemBO:" + this.parametersModel.getData().Site + "," + assemblyData.component + ",#";
				component.qty = assemblyData.qtyToAssemble;
				component.bomComponentRef = assemblyData.bomCompRef;

				if (!(assemblyData.assyDataType === "NONE")) {
					assemblyDataField.attribute = assemblyData.assyDataType;
					assemblyDataField.value = assemblyData.assemblyDataCollection;
					var assemblyDataFields = new Array(assemblyDataField);
					component.assemblyDataFields = assemblyDataFields;
				}

				var componentList = new Array(component);
				param.componentList = componentList;

				that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
						var msg = 'Component: ' + assemblyData.component + ' for SFC: ' + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
							"workListModel").getObject().sfc + ' assembled successfully';
						MessageToast.show(msg);
						that._loadComponentList();
						that.assemblyDataModel.setData("");
					})
					.catch(function (error) {
						//console.log(error);
					});
			}

		},
		//Assembly Progress Indicator
		getProgressIndicatorLabel: function (fRequiredQty, fAssembledQty) {
			return that._oI18nResourceBundle.getText("assyPointPlugin.progressBar.txt", [fAssembledQty - fRequiredQty, fRequiredQty]);
		},
		//Assmbely Progress Indicator Percentage
		getProgressIndicatorPercentValue: function (fRequiredQty, fAssembledQty) {
			if (!fRequiredQty) {
				// hide progressBar
				this.viewModel.setProperty("/isProgressBarVisible", false);
				return 0;
			} else {
				return fAssembledQty / fRequiredQty * 100;
			}
		},

		/*
		*********** Section for Characteristic Plugin *******
		
		*****************************************************
		*/
		//Load Characteristics Data
		_loadCharacterList: function () {
			var param = {
				"ref": ""
			};
			param.ref = "ShopOrderBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().shopOrder;
			var url = "/manufacturing-rest/web-api/ShopOrderServiceRPC/findShopOrderCharacteristics?Site=" + this.parametersModel.getData().Site +
				"&FORM_ID=" + that.formID;
			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.charcterModel.setData(data);
				})
				.catch(function (error) {
					//console.log(error);
				});
			//	this.charcterModel.loadData(jQuery.sap.getResourcePath("com/sap/me/customOperationPOD/data/characteristicList.json"), "", false);
		},

		/*
		********* Section for Work Instruction Plugin *******
		
		*****************************************************
		*/
		//Load Work Instruction Data
		_loadWorkInstruction: function () {
			var param = {
				"site": "",
				"sfcRef": "",
				"attached": ""
			};

			var operation = {
				"ref": ""
			};
			operation.ref = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," + this.parametersModel
				.getData().OperationVersion;
			var operationList = new Array(operation);
			var operationListJson = {
				"operationList": ""
			};
			operationListJson.operationList = operationList;
			param.attached = operationListJson;
			param.site = this.parametersModel.getData().Site;
			param.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().sfc;
			var url = "/manufacturing-rest/web-api/pod/getWorkInstructionList?FORM_ID=" + that.formID;

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.workInstructionModel.setData(data);
					that._setViewerFirst();
				})
				.catch(function (error) {
					//console.log(error);
				});
			//this.workInstructionModel.loadData(jQuery.sap.getResourcePath("com/sap/me/customOperationPOD/data/workInstruction.json"), "", false);
			//this._load3dModel();
		},
		//On Selection of Work Instruction
		fnWISelect: function (event) {
			//	if (event.getParameter("selectedItem").getContent().length <= 0) {
			if (event.getParameter("item")) {
				if (event.getParameter("item").getContent().length <= 0) {
					//var object = event.getParameter("selectedItem");
					var object = event.getParameter("item");
					var oWorkInstruction = object.getBindingContext("workInstructionModel").getObject();
					if ("FILE" === oWorkInstruction.type) {
						that._populateFileData(object, oWorkInstruction);
					} else if (("TEXT" === oWorkInstruction.type) && !(oWorkInstruction.plainText)) {
						that._populateRichText(object, oWorkInstruction);
					} else {
						that._setViewer(object, oWorkInstruction);
					}
				}
			}
		},
		//On Work Instruction Close
		fnWICloseHandler: function (oEvent) {
			// prevent the tab being closed by default
			oEvent.preventDefault();

			//var oTabContainer = this.byId("wiIconBar");
			var oItemToClose = oEvent.getParameter('item');
			var path = oEvent.getParameter("item").getBindingContext("workInstructionModel").getPath().replace("/", "");

			MessageBox.confirm("Do you want to close the tab '" + oItemToClose.getName() + "'?", {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						//oTabContainer.removeItem(oItemToClose);
						oItemToClose.destroyContent();
						var WIData = that.workInstructionModel.getData();
						WIData.splice(path, 1);
						that.workInstructionModel.setData(WIData);
						MessageToast.show("Item closed: " + oItemToClose.getName(), {
							duration: 500
						});
					} else {
						MessageToast.show("Item close canceled: " + oItemToClose.getName(), {
							duration: 500
						});
					}
				}
			});
		},
		//Set First Viewer Data 
		_setViewerFirst: function () {
			var object = that.getView().byId("wiIconBar").getItems()[0];
			var oWorkInstruction = object.getBindingContext("workInstructionModel").getObject();
			if ("FILE" === oWorkInstruction.type) {
				that._populateFileData(object, oWorkInstruction);
			} else if (("TEXT" === oWorkInstruction.type) && !(oWorkInstruction.plainText)) {
				that._populateRichText(object, oWorkInstruction);
			} else {
				that._setViewer(object, oWorkInstruction);
			}
		},
		//Function to Populate Rich Text
		_populateRichText: function (object, oWorkInstruction) {
			var url = "/manufacturing-rest/web-api/WorkInstructionConfigurationServiceRPC/readWorkInstruction?Site=" +
				this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
			var param = {
				"ref": ""
			};
			param.ref = oWorkInstruction.ref;
			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					oWorkInstruction.instructionData = data.instructionData;
					that._setViewer(object, oWorkInstruction);
				})
				.catch(function (error) {
					//console.log(error);
				});

		},
		//Function to Populate File Data
		_populateFileData: function (object, oWorkInstruction) {
			var url = "/manufacturing-rest/web-api/FileAttachmentConfigurationServiceRPC/findFileAttachmentsBasicDataByInternalIds?Site=" +
				this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
			var param = {
				"internalIdList": ""
			};
			var internalId = {
				"internalId": ""
			};
			internalId.internalId = oWorkInstruction.internalId;
			var internalIdArray = new Array(internalId);
			param.internalIdList = internalIdArray;
			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					oWorkInstruction.fileMimeType = data.fileAttachmentBasicConfigurationList[0].fileMimeType;
					oWorkInstruction.fileName = data.fileAttachmentBasicConfigurationList[0].fileName;
					that._setViewer(object, oWorkInstruction);
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//Set Viewer Data
		_setViewer: function (object, oWorkInstruction) {
			var wiSite = that.parametersModel.getData().Site;
			var wiFormId = that.formID;
			if ("TEXT" === oWorkInstruction.type) {
				var htmlParam = {
					"content": ""
				};
				if (oWorkInstruction.plainText) {
					htmlParam.content = "<p>" + oWorkInstruction.instructionData + "</p>";
				} else {
					htmlParam.content = oWorkInstruction.instructionData;
				}
				var html = new HTML(htmlParam);
				object.destroyContent();
				object.addContent(html);

			} else {
				if (!oWorkInstruction.fileMimeType) {
					var aMimeTypeValue;
					if (oWorkInstruction.erpWI && oWorkInstruction.erpFilename) {
						var aErpFilename = oWorkInstruction.erpFilename.split(".");
						oWorkInstruction.fileMimeType = aErpFilename[aErpFilename.length - 1].toLowerCase();
					} else if (oWorkInstruction.type === "URL" && oWorkInstruction.url) {
						var oUrlReg = /\S+\/\S+\.\w+$/;
						if (oUrlReg.test(oWorkInstruction.url)) {
							var sAfterLastSlash = oWorkInstruction.url.substr(oWorkInstruction.url.lastIndexOf("/") + 1);
							aMimeTypeValue = sAfterLastSlash.split(".");
							oWorkInstruction.fileMimeType = aMimeTypeValue[aMimeTypeValue.length - 1].toLowerCase();
						} else {
							oWorkInstruction.fileMimeType = "html";
						}
					}
				} else {
					aMimeTypeValue = oWorkInstruction.fileMimeType.split("/");
					oWorkInstruction.fileMimeType = aMimeTypeValue[aMimeTypeValue.length - 1].toLowerCase();
				}

				if ("FILE" === oWorkInstruction.type) {
					if ("octet-stream" === oWorkInstruction.fileMimeType) {
						var aFileTypeValue = oWorkInstruction.fileName.split(".");
						oWorkInstruction.fileMimeType = aFileTypeValue[aFileTypeValue.length - 1].toLowerCase();
					}
				}

				if (!oWorkInstruction.fileMimeType) {
					oWorkInstruction.fileMimeType = "html";
				}

				if (this.aPicturesTypes.indexOf(oWorkInstruction.fileMimeType) > -1) {
					oWorkInstruction.fileMimeType = "jpg";
				}

				if (oWorkInstruction.internalId) {
					oWorkInstruction.url = "/manufacturing-rest/web-api/files/download" + "?id=" + oWorkInstruction.internalId + "&site=" + wiSite +
						"&FORM_ID=" + wiFormId;
					if (this.aStreamedTypes.indexOf(oWorkInstruction.fileMimeType) > -1) {
						oWorkInstruction.url = oWorkInstruction.url + '&removeContentDisposition=true';
					} else {
						oWorkInstruction.url = oWorkInstruction.url + "&removeContentDisposition=false";
					}
				} else if (oWorkInstruction.erpWI) {
					var sWiOrigin = new URL(oWorkInstruction.url).origin;
					if (location.origin === sWiOrigin) {

					} else {
						oWorkInstruction.url = "/manufacturing-rest/web-api/destinationpath/getfile" + "?id=" + oWorkInstruction.wiName + "&revision=" +
							oWorkInstruction.revision + "&erpFileName=" + oWorkInstruction.erpFilename + "&site=" + wiSite + "&FORM_ID=" + wiFormId;
						if (this.aStreamedTypes.indexOf(oWorkInstruction.fileMimeType) > -1) {
							oWorkInstruction.url = oWorkInstruction.url + "&attachment=false";
						} else {
							oWorkInstruction.url = oWorkInstruction.url + "&attachment=true";
						}
					}
				} else if (oWorkInstruction.url) {
					if (oWorkInstruction.isUnsupportedFile || jQuery.sap.startsWith(oWorkInstruction.url, "file:")) {
						oWorkInstruction.type = "FILE";
						oWorkInstruction.url = "/manufacturing-rest/web-api/multi-viewer-files/findByExternalUrl" + "?fileUrl=" + oWorkInstruction.url +
							"&FORM_ID=" + wiFormId;
					}
				}

				if (that.aViewerSupportTypesV1_52.indexOf(oWorkInstruction.fileMimeType) > -1) {
					var height = (that.documentHeight - 308) + "px";
					var viewer = new Viewer({
						"showSceneTree": false,
						"height": height
					});
					var contentResource = new ContentResource({
						source: oWorkInstruction.url,
						sourceType: oWorkInstruction.fileMimeType,
						sourceId: oWorkInstruction.wiName
					});
					viewer.addContentResource(contentResource);
					object.destroyContent();
					object.addContent(viewer);

				} else if ("pdf" === oWorkInstruction.fileMimeType) {
					var param = {
						"source": "",
						"height": ""
					};
					param.source = oWorkInstruction.url;
					param.height = (that.documentHeight - 308) + "px";
					var pdfViewer = new PDFViewer(param);
					object.destroyContent();
					object.addContent(pdfViewer);
				} else {
					var eParam = {
						"content": ""
					};
					eParam.content = "<p>" + "Unsupported Media Type!!!" + "</p>";
					var ehtml = new HTML(eParam);
					object.destroyContent();
					object.addContent(ehtml);
				}
			}

		},
		/*
		********* Section for Data Collection Plugin ********
		
		*****************************************************
		*/
		_loadDataCollection: function () {
			var param = {
				"operationRef": "",
				"resourceRef": "",
				"workCenterRef": "",
				"activeOperationOnly": true,
				"collectDataAt": "ALL",
				"sfcRef": ""
			};

			param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
				this.parametersModel.getData().OperationVersion;
			param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
			param.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().sfc;
			param.workCenterRef = "WorkCenterBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem()
				.getBindingContext(
					"workListModel").getObject().workCenter;

			var url = "/manufacturing-rest/web-api/DataCollectionServiceRPC/findDcGroupsWithCollectedParametersForSfc?Site=" + this.parametersModel
				.getData().Site +
				"&FORM_ID=" + that.formID;

			var dataCollectionViewModelData = that.dataCollectionViewModel.getData();

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					that.dataCollectionModel.setData(data.dcGroupList);
					dataCollectionViewModelData.save = false;
					that.dataCollectionDetailModel.setData(new Array());
					that.dataCollectionViewModel.setData(dataCollectionViewModelData);
				})
				.catch(function (error) {
					//console.log(error);
				});
		},
		//On Click of Collect 
		collectData: function (event) {
			//that.dataCollectionDetailModel.setData(event.getSource().getParent().getBindingContext("dataCollectionModel").getObject().dcParameterList);
			that.dcGroupRef = event.getSource().getParent().getBindingContext("dataCollectionModel").getObject().dcGroupRef;
			var dcParamList = event.getSource().getParent().getBindingContext("dataCollectionModel").getObject().dcParameterList;

			var dataCollectionViewModelData = that.dataCollectionViewModel.getData();

			var count = 0;
			$.each(dcParamList, function (index, dcParam) {
				if (dcParamList[index].parametricMeasureList === null) {
					dcParamList[index].valueNotCollected = true;
				} else if (dcParamList[index].parametricMeasureList.length <= 0) {
					dcParamList[index].valueNotCollected = true;
				} else {
					dcParamList[index].valueNotCollected = false;
					dcParamList[index].enteredValue = dcParamList[index].parametricMeasureList[0].actual;
					dcParamList[index].enteredComment = dcParamList[index].parametricMeasureList[0].dcComment;
				}

				if (!(dcParamList[index].valueNotCollected)) {
					count = count + 1;
				}
			});
			if (count === dcParamList.length) {
				dataCollectionViewModelData.save = false;
			} else {
				dataCollectionViewModelData.save = true;
			}
			that.dataCollectionDetailModel.setData(dcParamList);
			that.dataCollectionViewModel.setData(dataCollectionViewModelData);

		},
		//Value Help for DC
		dataListValueHelp: function (event) {
			that.dcEvent = event.getSource();
			var data = event.getSource().getParent().getBindingContext("dataCollectionDetailModel").getObject();
			if (!that._oDialog) {
				that._oDialog = sap.ui.xmlfragment("com.sap.me.customOperationPOD.fragment.dcDialog", this);
			}
			that.getView().addDependent(that._oDialog);
			if (data.dataType === "BOOLEAN") {

				var dcdata = {
					"description": "",
					"validValueList": ""
				};
				dcdata.description = data.description;
				var nVal = {
					"value": ""
				};
				var pVal = {
					"value": ""
				};
				nVal.value = data.booleanZeroValue;
				pVal.value = data.booleanOneValue;
				var valList = new Array(nVal, pVal);
				dcdata.validValueList = valList;
				that.dataCollectionSuggestionModel.setData(dcdata);
				that._oDialog.open();
			} else if (data.dataType === "DATA_FIELD_LIST") {
				var param = {
					"ref": ""
				};
				param.ref = data.dataFieldRef;
				var url = "/manufacturing-rest/web-api/DataFieldConfigurationServiceRPC/readDataField?Site=" +
					this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
				that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (dataout) {
						that.dataCollectionSuggestionModel.setData(dataout);
						that._oDialog.open();
					})
					.catch(function (error) {
						//console.log(error);
					});
			}
		},
		//Open Comments Dialog for DC
		enterComments: function (oEvent) {
			that.dcEventComments = oEvent.getSource();
			var data = oEvent.getSource().getParent().getBindingContext("dataCollectionDetailModel").getObject();
			this.commentModel.setData(data);
			var oButton = oEvent.getSource();
			// create popover
			if (!this._oPopover) {
				Fragment.load({
					id: "popoverComments",
					name: "com.sap.me.customOperationPOD.fragment.comment",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		//Comments Dialog Cancel
		handleCommentCancel: function (oEvent) {
			this._oPopover.close();
		},
		//Comments Dialog Save
		handleCommentSave: function (oEvent) {
			var data = this.commentModel.getData();
			var path = that.dcEventComments.getParent().getBindingContext("dataCollectionDetailModel").getPath().replace("/", "");
			var dataCollectionDetailModelData = that.dataCollectionDetailModel.getData();
			dataCollectionDetailModelData[path].enteredComment = data.enteredComment;
			that.dataCollectionDetailModel.setData(dataCollectionDetailModelData);
			this._oPopover.close();
		},
		//DC Value Help Close
		_handleDCValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				that.dcEvent.setValue(oSelectedItem.getTitle());
			}

			if (!oSelectedItem) {
				that.dcEvent.resetProperty("value");
			}
		},
		//Log DC
		fnLogDC: function (oEvent) {
			var dataCollectionViewModelData = that.dataCollectionViewModel.getData();
			var url = "/manufacturing-rest/web-api/DataCollectionServiceRPC/logDCGroup?Site=" +
				this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
			var param = {
				"dcGroupRef": "",
				"operationRef": "",
				"resourceRef": "",
				"userRef": "",
				"activityId": "00",
				"sfcValueList": ""
			};
			param.dcGroupRef = that.dcGroupRef;
			param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
				this.parametersModel.getData().OperationVersion;
			param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
			param.userRef = "UserBO:" + this.parametersModel.getData().Site + "," + that.headingModel.getData().UserName;
			var sfcValue = {
				"sfcRef": "",
				"valueList": ""
			};
			sfcValue.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().sfc;
			var dcParamList = that.dataCollectionDetailModel.getData();
			var valueList = new Array();
			$.each(dcParamList, function (index, dcParam) {
				var dcValue = {
					"name": "",
					"value": "",
					"dataType": "",
					"dcComment": ""
				};
				if (dcParam.valueNotCollected) {
					if (dcParam.enteredValue) {
						if (dcParam.enteredValue !== "") {
							dcValue.name = dcParam.parameterName;
							dcValue.value = dcParam.enteredValue;
							dcValue.dataType = dcParam.dataType;
							dcValue.dcComment = dcParam.enteredComment;
							valueList.push(dcValue);
						}
					}
				}
			});
			sfcValue.valueList = valueList;
			var sfcValueList = new Array(sfcValue);
			param.sfcValueList = sfcValueList;

			that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
					var msg = 'DC Parameters for SFC ' + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
						"workListModel").getObject().sfc + ' saved successfully';
					MessageToast.show(msg);
					dataCollectionViewModelData.save = false;
					that.dataCollectionDetailModel.setData(new Array());
					that.dataCollectionViewModel.setData(dataCollectionViewModelData);
					that._loadDataCollection();

				})
				.catch(function (error) {
					MessageToast.show(error.responseText);
					//console.log(error);
				});

		},

		/*
		********* Section for SFC Action ********************
		
		*****************************************************
		*/
		//On SFC Start Action
		startSFC: function () {
			var statusCode = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().statusCode;
			if ((statusCode === "401") || (statusCode === "402")) {
				var url = "/manufacturing-rest/web-api/SfcStartServiceRPC/startSfc?Site=" +
					this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
				var param = {
					"sfcRef": "",
					"operationRef": "",
					"resourceRef": "",
					"qty": ""
				};
				param.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
					"workListModel").getObject().sfc;
				param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
					this.parametersModel.getData().OperationVersion;
				param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;
				param.qty = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
					"workListModel").getObject().qty;

				that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
						var msg = 'SFC ' + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
							"workListModel").getObject().sfc + ' started successfully';
						MessageToast.show(msg);
						that._reLoadWorkList();
					})
					.catch(function (error) {
						MessageToast.show(error.responseJSON.errorMessage);
						//console.log(error);
					});

			}
		},
		//On SFC Signoff Action
		signOffSFC: function () {
			var statusCode = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().statusCode;
			if (statusCode === "403") {
				var url = "/manufacturing-rest/web-api/SignoffServiceRPC/signoffSfc?Site=" +
					this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
				var param = {
					"sfcData": ""
				};
				var sfcData = {
					"sfcRef": "",
					"operationRef": "",
					"resourceRef": ""
				};

				sfcData.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
					"workListModel").getObject().sfc;
				sfcData.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation +
					"," + this.parametersModel.getData().OperationVersion;
				sfcData.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;

				var sfcDataArray = new Array(sfcData);
				param.sfcData = sfcDataArray;

				that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
						var msg = 'SFC ' + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
							"workListModel").getObject().sfc + ' signed-off';
						MessageToast.show(msg);
						that._reLoadWorkList();
					})
					.catch(function (error) {
						MessageToast.show(error.responseJSON.errorMessage);
						//console.log(error);
					});

			}
		},
		//on SFC Complete Action
		completeSFC: function () {
			var statusCode = that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
				"workListModel").getObject().statusCode;
			if (statusCode === "403") {
				var url = "/manufacturing-rest/web-api/SfcCompleteServiceRPC/completeSfc?Site=" +
					this.parametersModel.getData().Site + "&FORM_ID=" + that.formID;
				var param = {
					"sfcRef": "",
					"operationRef": "",
					"resourceRef": ""
				};
				param.sfcRef = "SFCBO:" + this.parametersModel.getData().Site + "," + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
					"workListModel").getObject().sfc;
				param.operationRef = "OperationBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Operation + "," +
					this.parametersModel.getData().OperationVersion;
				param.resourceRef = "ResourceBO:" + this.parametersModel.getData().Site + "," + this.parametersModel.getData().Resource;

				that._executeAPIPOST(JSON.stringify(param), 'POST', url).then(function (data) {
						var msg = 'SFC ' + that.getView().byId("idWorkList").getSelectedItem().getBindingContext(
							"workListModel").getObject().sfc + ' completed successfully';
						MessageToast.show(msg);
						that._reLoadWorkList();
					})
					.catch(function (error) {
						//console.log(error);
						MessageToast.show(error.responseJSON.errorMessage);
					});

			}
		},

		//Function for Key Press Events
		setKeyboardShortcuts: function () {
			$(document).keydown($.proxy(function (evt) {
				switch (evt.keyCode) {
				case 117:
					that.startSFCKeyPress();
					break;
				case 118:
					that.signOffSFCKeyPress();
					break;
				case 119:
					that.completeSFCKeyPress();
					break;
				case 120:
					that.handleIOXPAssistKeyPress();
					break;
				}
			}, this));
		},
		/*
		*********** Function Keys *********************
		
		************************************************
		*/
		//Start SFC on Key Press F6(117)
		startSFCKeyPress: function () {
			if (that.getView().byId("idWorkList").getSelectedItem()) {
				that.startSFC();
			}
		},

		//Sign Off SFC on Key Press F7(118)
		signOffSFCKeyPress: function () {
			if (that.getView().byId("idWorkList").getSelectedItem()) {
				that.signOffSFC();
			}
		},

		//Complete SFC on Key Press F8(119)
		completeSFCKeyPress: function () {
			if (that.getView().byId("idWorkList").getSelectedItem()) {
				that.completeSFC();
			}
		},

		/*
		********* Common Functions *************************
		
		*****************************************************
		*/
		/* Function for Reading URL Parameters*/
		_urlParam: function (name) {
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (results === null) {
				return null;
			} else {
				return results[1] || 0;
			}
		},
		_executeAPIPOST: function (param, method, url) {
			return new Promise(
				function (resolve, reject) {
					$.ajax({
						url: url,
						type: method,
						contentType: "application/json",
						data: param,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
		},
		_executeAPI: function (param, method, url) {
			return new Promise(
				function (resolve, reject) {
					$.ajax({
						url: url,
						type: method,
						data: param,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
		},
		_executeAPIGET: function (method, url) {
			return new Promise(
				function (resolve, reject) {
					$.ajax({
						url: url,
						type: method,
						beforeSend: function (xhr) {
							//xhr.setRequestHeader("Authorization", "Basic " + btoa("site_admin:Visiprise1"));
							xhr.setRequestHeader("Authorization", "Basic " + btoa("i301873:Selva@1234"));
						},
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
		}
	});
});