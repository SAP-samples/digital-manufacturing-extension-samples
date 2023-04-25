[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/digital-manufacturing-extension-samples)](https://api.reuse.software/info/github.com/SAP-samples/digital-manufacturing-extension-samples)

Backend REST service Module for DMC Audit Log Viewer. This module is intended to be built and deployed directly onto the SaaS tenant where audit logs are to be observed.

# Pre-requisites

## Install mbt build tool if not already present

`npm i -g mbt`

Alternatively, follow the instructions in the [MTA Build Tool's documentation.](https://sap.github.io/cloud-mta-build-tool/download/)

## Cloud Foundry CLI with MTA plugins

Install cf cli if not already present. It can be installed by following the steps in the [Cloud Foundry CLI Documentation.](https://github.com/cloudfoundry/cli#downloads)

## Install the MTA plugin for Cloud Foundry CLI

 `cf install-plugin multiapps`

[Multiapps plugin documentation](https://github.com/cloudfoundry/multiapps-cli-plugin/blob/master/README.md)

## Install GNU Make

GNU Make should be manually installed on Windows machines. For troubleshooting on Mac machines, please refer to additional documentation below.

[GNU Make for Windows](https://github.com/mbuilov/gnumake-windows)

[Additional Documentation](https://sap.github.io/cloud-mta-build-tool/makefile/)

# Build & Deploy to Cloud Foundry

## Build the Project

`mbt build --mtar archive`

## Login to Cloud Foundry 

Login to the cloud foundry through the API URL. 
Be sure to choose the correct org and space!

`cf login [-a API_URL] [-u USERNAME] [-p PASSWORD] [-o ORG] [-s SPACE] [--sso | --sso-passcode PASSCODE] [--origin ORIGIN]`

## Deploy to Cloud Foundry

`cf deploy mta_archives/archive.mtar`