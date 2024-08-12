# dash-app-ml-devops: Dashboard to illustrate real-time stock price tracking and the prediction: organized by Azure services (MLOps and Machine learning project)

implement Docker/Kerbernete approach to the resource control once the project complexity requires more systematic management

## Overview of ReadME
1. Introduction
2. Project overview
3. Project components
4. Future Work
5. Additional note on resource management concept

## Introduction

This project demonstrate the CI/CD using Azure services. The detail are as follows:
1. ### Source Code Management (SCM): 

The source code is managed in this GitHub repository.

2. ### Continuous Integration (CI):

When changes are made to the main branch, Azure pipeline is triggered.
The workflow checks out code (lint, test, etc) (using container registry service to better the deployment as further steps)

3. ### Continuous Deployment (CD):

The workflow pulls the resource directly from main branch of the repository and deploy it to the target environment on Azure App Service
(Later use a container registry to ensure that your Docker images are versioned, stored securely, and can be easily accessed for deployment)


## Project overview

<img width="1792" alt="price_decision_fastapi_project_outline" src="image_readme\dash_app_project_overview.png">


Technologies Used:
1. Github and Azure Pipeline
3. Azure App Service
4. Flask and Javascript

## Project components
### Makefile: for install, test, format, lint. Used in development and CI
### requirements.txt: all dependencies for the program

### app directory
- app/views.py: The Flask app for dashbord, and the call to FastAPI ML Microservice for prediction.
- app/static folder: all css and javascript for the dashboard.
- app/templates folder: Flask app html template.
- __init__.py: instantiate Flask App to be called by webapp.py for startup app in Azure App Service.
- app/views.py: main Flask app.
### app_local.py: for local testing
### MAKEFILE: define install, lint, test, format to be called by Azure Devops pipeline
### azure-pipelines.yml
- build job: for install, lint, format, test files 
- deploy job: deploy in Azure App Service

### startup.py and startup.txt: to be called when the app starts up.

## Snipshot of service used

### Azure Devops Pipeline
<img width="1792" alt="price_decision_fastapi_project_github_action" src="image_readme\azure_devops_pipeline.png">

### Azure App Service and Dashapp
<img width="1792" alt="price_decision_fastapi_example" src="image_readme\dash_app_project_screenshot.png">

## Future Work

- currently he memory is done in Javascipt only which is not a very good approach. We may need to have backend storage to store Stock price and prediction for better visualization and analysis
- add Third party API to retreive stock price
- manage API in API manager
- Utilize docker and kebernetes for demonstration

## Additional note on resource management concept
Even though this is not implemented in this project. It is important to have a branch strategy when managing and developing programs with multiple stakeholders and environments. Here are the branch strategies I come up with as some examaples. Note that each strategy suits each project based on the neccessity of the branches, environment, and how the workflow is done in each project. By considering these, we can achieve the best practice of resource management, reducing blockers, maximize the development flow speed. 
Since this project is a personal project with more straightforward workflow. It is more efficient to keep things based on its minimal requirement as possible.

### example 1
<img width="1792" alt="branch_manage_ex1" src="image_readme\branch_manage_ex1.png">
This example is a complicated manangement with UAT branch in Production environment. Some of the use cases might be the systems with relationships with multiple systems (both upstream and downstream systems). By doing so, we can UAT test in the Production data and connections while being in our test resource.

### example 2
<img width="1792" alt="branch_manage_ex2" src="image_readme\branch_manage_ex2.png">
This example more straightforward. All test can be done in our Development environment. This should be more conventional and default setting for most projects to simplify the steps and make the workflow more efficient.



## reference 
### Fast api repository called by this project
- https://github.com/chawitzoon/dash-app-ml-devops/tree/main
### Use Azure Pipelines to build and deploy a Python web app to Azure App Service
- https://learn.microsoft.com/en-us/azure/devops/pipelines/ecosystems/python-webapp?view=azure-devops&tabs=linux
### Deployment Best Practices
- https://learn.microsoft.com/en-us/azure/app-service/deploy-best-practices#use-deployment-slots