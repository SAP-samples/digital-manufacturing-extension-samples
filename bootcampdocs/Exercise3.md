# Exercise 3 - Perform Assembly Operation with visual inspection


## Overview
In this exercise, we would like to show an example of Visual inspection during the production process at a specific Operation.
A Machine learning model will be used to process a visual image to determine a successful pass or fail for the inspection.
   
## Step 1: Build the Machine Learning Model

There are many tools available to build and train a Machine Learning Model. In this example, we will make use of Google Teachable Machine which is a quick and easy tool to create and train a model.

The model will be based on images of a Valve Head assembly. This will consist of 3 categories of image:

* SCREW_LEFT (Missing Left Hand side Screw)

* SCREW_RIGHT (Missing Right Hand side Screw)

* OK (Acceptable image with no inconsistancy)

### 1. Access Google Teachable Machine

Link: [Teachable_Machine](https://teachablemachine.withgoogle.com/)

Click on 'Get Started' button.
	
![](assets/Exercise_2/teachable_machine.PNG)

### 2. Create a Model

Select the 'Image Project'.
   
![](assets/Exercise_2/Image_Project.PNG)

Choose 'Standard Image Model'.
   
![](assets/Exercise_2/Standard_Model.PNG) 

The following User Interface will exist:

![](assets/Exercise_2/Initial_Class.PNG) 
   
The desired classes can now be created. In this case three classes: SCREW_LEFT, SCREW_RIGHT, OK. The third class can be inserted with the 'Add Class' button.

![](assets/Exercise_2/Defined_Classes.PNG) 

### 3. Upload Images

The sample images relevant to each class can now be uploaded by clicking the 'Upload' button within the relevant class.
   
Upload of the SCREW_LEFT images is shown. This can be achieved by dragging selected images across from a folder repository to the highlighted area. This should be repeated for each Class defined.
   
![](assets/Exercise_2/Screw_Left_Images.PNG)   
   
Once all images have been uploaded to the relevant classes, the result should look like in this way.
   
![](assets/Exercise_2/Model_With_Images.PNG)   

### 4. Train the Model

We can now Train the Model, by using the uploaded sample images for each class to give intelligence to the Model allowing it to decide if an image supplied to it is good or bad.
   
Click 'Train Model'. 

After a short delay (generally around 30 seconds), the model will display as 'Trained'.
   
![](assets/Exercise_2/Model_Trained.PNG)   
   
   
### 5. Export the Model

The model can now be exported by selecting 'Export Model'.
   
![](assets/Exercise_2/Export_Model.PNG) 

and then selecting the "Download" radio button and clicking 'Download My Model'.
   
![](assets/Exercise_2/Download_Model.PNG) 

This result in a zip file being downloaded will contain 3 files similar to the following structure.
   
![](assets/Exercise_2/Downloaded_Zip.PNG) 
   
We have now successfully created a machine learning model which we will consume in DMC in further steps.
   
## Step 2: Configure Nonconformance Code Structure
 
### 1. Create Nonconformance Code

Go to 'Manage Nonconformance Codes' app, and create two new Nonconformance code for **SCREW_LEFT** and **SCREW_RIGHT**.
   
**NOTE**: These NC codes should match the names of the classes within the machine learning model created in Step 1.
   
![](assets/Exercise_2/NC_SCREW_LEFT.PNG) 
![](assets/Exercise_2/NC_SCREW_RIGHT.PNG) 
 
### 2. Create Nonconformance Group

Go to 'Manage Nonconformance Groups' app, and create a new Nonconformance Group.

This Nonconformance Group should contain the two Nonconformance codes created previously.
  
![](assets/Exercise_2/NC_Group.PNG)  


## Step 3: Manage AI/ML Scenario
*This step will enable us to build the machine learning scenario allowing us to associate the previously generated machine learning model and Nonconformance code structure.*

### 1. Create an AI/ML Scenario

Go to 'Manage AI/ML Scenarios' app, and create a new scenario by selecting the 'Predictive Quality: Visual Inspection' scenario.
   
![](assets/Exercise_2/AIML_Select_Scenario.PNG)  
   
Enter a name and description for the Scenario, e.g. BOOTCAMP_VISUAL_INSP

![](assets/Exercise_2/AIML_Step1.PNG)     

Define the Scenario Available Combintation by clicking 'Define' and associate the relevant DMC Objects.

![](assets/Exercise_2/AIML_Scenario_Availability.PNG)     

Click 'Add' and the expected result is shown as below:
   
![](assets/Exercise_2/AIML_Step1_end.PNG)
   
Click 'Step 2' to configure the Scenario, choose the Visual Inspection Type to be 'Image Multi Class Classification', and select the Inspection Mode to be 'Assisted'.
  
![](assets/Exercise_2/AIML_Step2_config.PNG)

Now the files generated for the machine learning model in previous steps need to be added to the scenario. Either by clicking 'Add' to select files, or drag and drop files into the panel area. 

There are two files required to be added, **weights.bin** and **model.json**. 
   
![](assets/Exercise_2/AIML_Step2_Addedfiles.PNG)

Model input and preprocessing steps should be configured as follows:
  
![](assets/Exercise_2/AIML_Step2_ModelInput.PNG)

 Click 'Step 3' to the 'Scenario Deployment' step, and requires the additon of the classification classes that will be considered in the evaluation process in the POD Plugin. 
  
![](assets/Exercise_2/AIML_Step3.PNG)

Add the Nonconformance Group 'MISSING_SCREW', and then add a Conformance Class e.g. OK
   
![](assets/Exercise_2/AIML_Step3_AddNCGroup.PNG)
![](assets/Exercise_2/AIML_Step3_AddNCGroup_MissScrew.PNG)
 
Each Entry requires a Class Title to be entered as below:
   
![](assets/Exercise_2/AIML_Step3_AddNCClassTitle.PNG) 

Click 'Step 4', and this step will allow us to have an option to test the scenario.
   
![](assets/Exercise_2/AIML_Step4.PNG) 

Click 'Review', and we can check the configurations in previous steps. The model can be deployed by clicking 'Save and Activate'. The resultant model will then display as 'Activated' on the main AI/ML page.
   
![](assets/Exercise_2/AIML_Step4_Activated.PNG) 

## Step 4: Test and Transact the Scenario

Create and relase an SFC against a shop order relating to the LIFTER-ASSY material.

Open the predefined DMC BootCamp POD.

Select and start the desired SFC and Operation.

![](assets/Exercise_2/AIML_Step5.PNG) 

Shift to the Visual Inspector tab, the Webcam associated with the PC / Laptop device being used by the operator can be used to capture an image of the assembled product for verification in the POD.
   
![](assets/Exercise_2/AIML_Step5_VI_Display.PNG) 

In this example, we will force a predetermined image into the POD. This will be done via a Postman API call.
   
In order to achieve this, the image to be passed via the API should be converted to a BASE-64 form. This can be realized via a tool such as     [Base64 Converter](https://codebeautify.org/image-to-base64-converter) .
   
Within Postman, import the Postman Collection.Select the 'POST InspectionLog' from the Visual Inspection folder.
![](assets/Exercise_2/AIML_Step5_Postman1.PNG)    

The Body should be configured as below, ensuring all inputs (e.g. plant, SFC) correspond to required values. The BASE-64 converted file content should also be inserted.
   
![](assets/Exercise_2/AIML_Step5_Postman_Input.PNG)    
   
After sending the POST request, a successful posting will result in the selected image being displayed in the POD, with a calculated result suggesting if the image is either conformant or nonconformant to the process.  

In this example, the model has calculated probability of the left screw being missing in the assembly is 99%.
   
![](assets/Exercise_2/AIML_Step5_VI_Result.PNG)