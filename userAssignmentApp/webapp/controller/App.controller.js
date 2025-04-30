sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Column",
  "sap/m/ColumnListItem",
  "sap/m/Label"

], function (BaseController, JSONModel, MessageToast, MessageBox, Column, ColumnListItem, Label) {
  "use strict";

  return BaseController.extend("userAssignmentApp.controller.App", {
    onInit: function () {
      var that = this;
    },

    /*---------------------------------------Step 1 Upload Users --------------------------------------------*/

    /*Browsing for a file trigger the upload of the CSV file */
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
          // that.getView().getModel("userListModel").refresh(true);
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
      // Step 3: Create a new JSON Model with the parsed object
      var jsonModel = new sap.ui.model.json.JSONModel(result);
      that.getView().setModel(jsonModel, "userListModel");
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


    /*---------------------------------------Step 2 - Retrieve the available User Groups and display the details--------------------------------------------*/

    onDisplayUserGroups: function (oEvent) {
      // Call the onCheckInputs function to check if Plant and maste user group (user) is set
      const isInputsValid = this.onCheckInputsRetrieveUserGroups();
      // Handle the return status
      if (isInputsValid) {
        var that = this;
        var baseURLgetUser = "/dmeapi/user/v1/supervisors"
        // Get the Input field plant
        var plant = this.getView().byId("inputPlant1").getValue();
        // Get the Input field userID
        var userId = this.getView().byId("inputUserGroupUser").getValue();
        // Build the URL
        var sURL = baseURLgetUser + "?Plant=" + plant + "&userId=" + userId;

        $.ajax({
          type: "GET",
          url: sURL,
          contentType: "application/json",
          dataType: "json",

          success: function (response) {
            // Add the response data to the JSON model
            // Transform supervisedUserIds array into an array of objects
            const transformedData = response.supervisedUserIds.map(item => ({ supervisedUserId: item }));

            // Create the model
            const oModel = new sap.ui.model.json.JSONModel({ supervisedUserIds: transformedData });
            // Set the model to the view

            that.getView().setModel(oModel, "templateUserListModel");
            that.getView().getModel("templateUserListModel").refresh(true);

          },
          error: function (error) {
            // Check if the status code is 404
            if (error.status === 404) {
              console.error("Error 404: User not found");
              // Display an error message to the user
              sap.m.MessageBox.error("The requested User could not be found (404). Please check your inputs");
            } else {
              console.error("An unexpected error occurred:", error.status);
              sap.m.MessageBox.error("An unexpected error occurred. Please try again.");
            }
          }
        });

      }
    },

    onCheckInputsRetrieveUserGroups: function () {
      let isValid = true; // Assume inputs are valid initially
      // Get the input fields by their IDs
      const oInput1 = this.getView().byId("inputPlant1");
      const oInput2 = this.getView().byId("inputUserGroupUser");

      // Retrieve their values
      const sValue1 = oInput1.getValue();
      const sValue2 = oInput2.getValue();

      // Check if either of the input fields is empty
      if (!sValue1 || !sValue2) {
        // If one or both are empty, highlight the fields and show a message
        if (!sValue1) {
          oInput1.setValueState("Error");
          oInput1.setValueStateText("This field cannot be empty!");
          isValid = false; // Mark as invalid
        } else {
          oInput1.setValueState("None");
        }

        if (!sValue2) {
          oInput2.setValueState("Error");
          oInput2.setValueStateText("This field cannot be empty!");
          isValid = false; // Mark as invalid
        } else {
          oInput2.setValueState("None");
        }

        // Show a message to the user
        sap.m.MessageToast.show("Please fill in all required fields.");
      } else {
        // If both inputs are filled, reset their states and proceed
        oInput1.setValueState("None");
        oInput2.setValueState("None");

      }
      return isValid;

    },

    onTemplateUserSelectionChange: function (oEvent) {
      var that = this;
      // Get the selected row (list item)
      const oSelectedItem = oEvent.getParameter("listItem");
      // Get the binding context of the selected item
      const selectedData = oSelectedItem.getBindingContext("templateUserListModel").getObject();
      var userId = selectedData.supervisedUserId;
      // Perform actions with the selected data
      console.log("Selected Supervisor ID:", selectedData.supervisedUserId);
      // Get selected userId
      var userId = selectedData.supervisedUserId;
      // Get plant from the model or input field
      var plant = this.getView().byId("inputPlant1").getValue();
      that.displayTemplateUser(plant, userId);

    },


    displayTemplateUser: function (plant, templateUserId) {

      var that = this;
      var baseURLgetUser = "/dmeapi/user/v1/users"
      // Get the Input field plant
      var plant = plant
      // Get the Input field userID
      var userId = templateUserId;
      // Build the URL
      var sURL = baseURLgetUser + "?Plant=" + plant + "&userId=" + userId;

      $.ajax({
        type: "GET",
        url: sURL,
        contentType: "application/json",
        dataType: "json",

        success: function (response) {
          // Add the response data to the JSON model
          // Create the model
          const oModel = new sap.ui.model.json.JSONModel(response);
          that.getView().setModel(oModel, "templateUserModel");
          that.getView().getModel("templateUserModel").refresh(true);

        },
        error: function (error) {
          // Check if the status code is 404
          if (error.status === 404) {
            console.error("Error 404: User not found");
            // Display an error message to the user
            sap.m.MessageBox.error("The requested User could not be found (404). Please check your inputs");
          } else {
            console.error("An unexpected error occurred:", error.status);
            sap.m.MessageBox.error("An unexpected error occurred. Please try again.");
          }
        }

      });

    },

    /*------------------------Step 3 - Create Users --------------------------------------------------*/

    //create users for all users on the list, using the selected template User
    onCreateUser: function () {
      var that = this;

      // Get Input values
      var userList = that.getView().getModel("userListModel").getData();
      var templateUser = that.getView().getModel("templateUserModel").getData();

      //Create models to display successful and failed users as a result in the view
      var successfullyCreatedUsers = [];
      var failedUserCreation = [];
      that.getView().setModel(new sap.ui.model.json.JSONModel(successfullyCreatedUsers), "createdUsersModel");
      that.getView().setModel(new sap.ui.model.json.JSONModel(failedUserCreation), "failedUsersModel");

      // Check if userList and templateUser are not empty or null
      if (!userList || userList.length === 0) {
        console.error("User list is empty or null.");
        return;
      }
      if (!templateUser) {
        console.error("Template user is empty");
        return;
      }

      // Iterate through each user in the userList (except the first entry)
      for (var i = 0; i < userList.length; i++) {
        var currentUser = userList[i];

        // Prepare the payload for creating a new user
        var newUser = {
          plant: templateUser.plant,
          userId: currentUser.Email,
          email: currentUser.Email,
          firstName: currentUser.FirstName,
          lastName: currentUser.LastName,
          userCertifications: templateUser.userCertifications,
          userWorkCenters: templateUser.workCenters,
          modifiedDateTime: new Date().toISOString(),
          createdDateTime: new Date().toISOString()
        };
        // Call the API to create the user
        that.createUserAPI(newUser, successfullyCreatedUsers, failedUserCreation, currentUser);
      }
    },

    createUserAPI: function (userPayload, successfullyCreatedUsers, failedUserCreation, currentUser) {
      var that = this;
      var baseURLgetUser = "/dmeapi/user/v1/users"
      // Make an API call to create the user
      $.ajax({
        url: baseURLgetUser, // Replace with the correct API endpoint
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(userPayload),
        success: function (response) {
          console.log("User created successfully:", response);

          // Add successfully created user to the list
          successfullyCreatedUsers.push({
            userId: currentUser.ID,
            email: currentUser.Email,
            firstName: currentUser.FirstName,
            lastName: currentUser.LastName
          });

          // Update the model dynamically after each successful creation
          that.getView().getModel("createdUsersModel").setData(successfullyCreatedUsers);
        },
        error: function (response) {
          console.log("Error creating user:", response);
          // REMOVE Add error into successfully created user to the list to check UI
          failedUserCreation.push({
            userId: currentUser.ID,
            email: currentUser.Email,
            firstName: currentUser.FirstName,
            lastName: currentUser.LastName
          });

          // Update the model dynamically after each successful creation
          that.getView().getModel("failedUsersModel").setData(failedUserCreation);

        }
      });
    }

  });
});