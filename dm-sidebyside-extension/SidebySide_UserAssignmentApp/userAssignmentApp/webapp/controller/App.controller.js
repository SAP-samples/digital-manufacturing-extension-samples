sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/Column",
  "sap/m/ColumnListItem",
"sap/m/Label"

], function (BaseController, JSONModel, MessageToast, Column,ColumnListItem,Label) {
  "use strict";

  return BaseController.extend("userAssignmentApp.controller.App", {
    onInit: function () {
      var that = this;
      var oModel = new JSONModel();
      that.getView().setModel(oModel);

      var sampleModel = new sap.ui.model.json.JSONModel();
      that.getView().setModel(sampleModel, "sampleModel");

      var columnModel = new JSONModel();
      that.getView().setModel(columnModel, "columnModel");

      this.onRestCall();
    },
    
    successREST: function(data){
      debugger
    },
    errorREST: function(error)
    {
      debugger;

    },

    onRestCall: function(){
      var sURL= "/dmeapi/user/v1/users?Plant=KH01&email=katja.huschle@sap.com";
      $.ajax({
        type: "GET",
        url:sURL,
        contentType:"application/json",
        dataType:"json",
        success:[this.successREST,this],
        error: [this.errorREST, this]
      });
    },


    handleUploadComplete: function (oEvent) {
      // Please note that the event response should be taken from the event parameters but for our test example, it is hardcoded.

      var sResponse = "File upload complete. Status: 200",
        iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
        sMessage;

      if (sResponse) {
        sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
        MessageToast.show(sMessage);
      }

    },

    handleUploadPress: function () {
      var that = this;
      var oFileUploader = this.getView().byId("FileUploaderid");
      var oFileInput = oFileUploader.getDomRef().querySelector("input[type='file']");
      var oFile = oFileInput.files[0];

      if (oFile.checkFileReadable) {
        MessageToast.show("The file cannot be read. It may have changed.");
      } else {
        oFileUploader.upload();
      }
  

      //To check the File type of uploaded File.
      if (oFile.type === "text/csv") {
        that.typeCsv();
      }
      
    },


    /* Function to read the CSV file */
    typeCsv: function () {
      var that = this;
      var userTable = this.getView().byId("userTable");
      var oFileUploader = this.getView().byId("FileUploaderid");
      var oFileInput = oFileUploader.getDomRef().querySelector("input[type='file']");
      var oFile = oFileInput.files[0];
      if (oFile && window.FileReader) {
        var reader = new FileReader();
        reader.onload = function (evt) {
          var strData = evt.target.result;
          that.csvJSON(strData);
          that.getView().getModel("userListModel").refresh(true);
          // Step 3: Refresh the Table
          
          userTable.getBinding("items").refresh();
        };
        reader.onerror = function (exe) {
          console.log(exe);
        };
        reader.readAsText(oFile);

      }

    },
    /* Function to convert CSV into JSON */
    csvJSON: function (csv) {
      var that = this;
      var lines = csv.split("\r\n");
      var result = [];
      var colheaders = lines[0].split(";");
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(";");
        for (var j = 0; j < colheaders.length; j++) {
          obj[colheaders[j]] = currentline[j];
        }
        result.push(obj);
      }
      // Convert the array of objects to JSON
     // var jsonModel = JSON.stringify(result, null, 2);
// Step 2: Parse the JSON String into a JavaScript object
//var dataObject = JSON.parse(jsonString);

// Step 3: Create a new JSON Model with the parsed object
var jsonModel = new sap.ui.model.json.JSONModel(result);


      //that.getView().getModel("userListModel").setProperty("/", jsonModel);
      that.getView().setModel(jsonModel, "userListModel");
     // var oTable = that.getView().byId(userTable);
    //  oTable.setModel(jsonModel, "userListModel")
     // oTable.getBinding("items").refresh();
/*
      var oNewModel = new sap.ui.model.json.JSONModel(newData);

      // Step 2: Set the Model to the View or Control with a specific name
      var oView = this.getView();
      oView.setModel(oNewModel, "mySpecificModel");
      
      // Step 3: Access and Refresh the Specific Model in the Table
      var oTable = oView.byId("yourTableId");
      oTable.setModel(oNewModel, "mySpecificModel");
      
      // Optional: Bind the table items to the named model
      oTable.bindItems({
        path: "mySpecificModel>/people",
        template: new sap.m.ColumnListItem({
          cells: [
            new sap.m.Text({ text: "{mySpecificModel>name}" }),
            new sap.m.Text({ text: "{mySpecificModel>age}" })
          ]
        })
      });
      
      // Step 4: Refresh the Table Binding (if required)
      oTable.getBinding("items").refresh();


*/




  


     // that.generateTableCsv();
    },

    /*	Function to create the table dynamically for csv File*/
    generateTableCsv: function () {
      var that = this;
      var oTable = that.getView().byId("Tableid");
      var oModel = that.getView().getModel();
      var oModelData = oModel.getProperty("/");
      var ColumnsData = Object.keys(oModelData[0]);
      var oColumnNames = [];
      $.each(ColumnsData, function (i, value) {
        oColumnNames.push({
          Text: ColumnsData[i]
        });
      });
      oModel.setProperty("/columnNames", oColumnNames);
      var columnmodel = that.getView().getModel("columnModel");
      columnmodel.setProperty("/", oColumnNames);
      var oTemplate = new Column({
        header: new Label({
          text: "{Text}"
        })
      });
      oTable.bindAggregation("columns", "/columnNames", oTemplate);
      var oItemTemplate = new ColumnListItem();
      var oTableHeaders = oTable.getColumns();
      $.each(oTableHeaders, function (j, value) {
        var oHeaderName = oTableHeaders[j].getHeader().getText();
        oItemTemplate.addCell(new Text({
          text: "{" + oHeaderName + "}"
        }));
      });
      oTable.bindAggregation("items", {
        path: "/",
        template: oItemTemplate

      });

    }
  });
});