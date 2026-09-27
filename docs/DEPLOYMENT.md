# PrivateVault Deployment Guide

## 1. Overview

This document describes how to deploy the PrivateVault backend and frontend.

The project contains:

- React/Vite frontend
- Python Azure Function backend
- Azure SQL Database
- Private Azure networking

---

## 2. Prerequisites

Install the following tools:

- Git
- Node.js and npm
- Python
- Azure CLI
- Azure Functions Core Tools
- Microsoft ODBC Driver 18 for SQL Server

You also need:

- An Azure subscription
- Permission to create Azure resources
- Access to the PrivateVault Azure resource group
- VPN configuration for private testing

---

## 3. Clone the Repository

Clone the GitHub repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd privatevault-frontend
4. Frontend Setup

Install the frontend dependencies:

npm install
5. Frontend Environment Configuration

Create a local .env file.

Example:

VITE_API_URL=https://<function-hostname>/api/users

Do not commit the real .env file.

The .env file is excluded by .gitignore.

6. Run Frontend Locally

Start the Vite development server:

npm run dev

The frontend can normally be accessed at:

http://localhost:5174

The port may change if another application is already using the default Vite port.

7. Build Frontend

Create a production build:

npm run build

The compiled files are generated in:

dist/

The dist directory is excluded from Git.

8. Azure CLI Login

Log in to Azure:

az login

Verify the current subscription:

az account show

List available subscriptions:

az account list -o table

Select the required subscription:

az account set --subscription "<SUBSCRIPTION-ID>"
9. Azure Function Project

The Python Function uses the Azure Functions Python programming model.

Important files:

function_app.py
requirements.txt
host.json

The main API route is:

/api/users
10. Function Dependencies

The Function requires:

azure-functions
pyodbc

These are stored in:

requirements.txt

Install locally if required:

pip install -r requirements.txt
11. Function Application Settings

The Function App uses environment variables for SQL connectivity.

Required settings:

SQL_SERVER
SQL_DATABASE
SQL_USERNAME
SQL_PASSWORD

These values must be configured in Azure Function App settings.

Do not hard-code the SQL password in the source code.

Do not commit the password to GitHub.

12. Deploy Azure Function

From the Function project directory, authenticate with Azure:

az login

Then deploy using Azure Functions Core Tools:

func azure functionapp publish serverless-project-T049 --python

The command performs the deployment to the existing Function App.

13. Python Runtime

The Azure Function uses:

Python 3.13

The local Python version should preferably match the Azure Function runtime.

Check local Python:

python --version

Check Azure Function configuration in the Azure Portal if required.

14. Verify Function Deployment

List deployed functions:

az functionapp function list \
  --resource-group rg-serverless-project \
  --name serverless-project-T049 \
  -o table

The users HTTP function should be present.

15. CORS Configuration

The React development application runs on:

http://localhost:5174

Add the frontend origin:

az functionapp cors add \
  --resource-group rg-serverless-project \
  --name serverless-project-T049 \
  --allowed-origins http://localhost:5174

Verify:

az functionapp cors show \
  --resource-group rg-serverless-project \
  --name serverless-project-T049 \
  -o json

Expected configuration includes:

{
  "allowedOrigins": [
    "https://portal.azure.com",
    "http://localhost:5174"
  ]
}
16. Private Networking Requirements

Before testing the Function API, verify:

Function Public Access:
Disabled

SQL Public Access:
Disabled

Function Private Endpoint:
Approved

SQL Private Endpoint:
Approved

Function VNet Integration:
Enabled

Private DNS:
Configured
17. VPN Connection

For private client-side testing, connect to the Point-to-Site VPN.

The VPN provides access to the Azure VNet.

The client receives an address from:

172.16.0.0/24
18. Test Function Private Endpoint

The Function private endpoint uses:

10.0.2.4

Test TCP connectivity:

Test-NetConnection 10.0.2.4 -Port 443

Expected:

TcpTestSucceeded : True
19. Test DNS Resolution

The Function hostname should resolve through the private DNS configuration when accessed from the private network.

Example PowerShell test:

[System.Net.Dns]::GetHostAddresses("<FUNCTION-HOSTNAME>")

The result should contain:

10.0.2.4
20. Test API

After connecting to the VPN and confirming private DNS resolution, test the Function API:

curl.exe "https://<FUNCTION-HOSTNAME>/api/users"

Expected response:

HTTP 200

The response should contain the user records retrieved from Azure SQL.

21. Frontend Test

Start the frontend:

npm run dev

Open:

http://localhost:5174

The dashboard should show:

API Status: 200 OK
Database: PRIVATE
Live Users: 5
22. Deployment Flow
Developer
    ¦
    ?
Git Repository
    ¦
    +---------------+
    ?               ?
React Frontend    Azure Function
    ¦               ¦
    ¦               ?
    ¦          Azure SQL
    ¦
    ?
PrivateVault Dashboard
23. Important Security Rules

Never commit:

.env
*.b64
*.cer
*.pfx
*.key
*.pem

Never commit:

SQL passwords
VPN private keys
Private certificates
Azure credentials
Access tokens
API keys

The repository .gitignore already excludes sensitive files.

24. Deployment Checklist

Before deployment:

 Azure CLI installed
 Azure Functions Core Tools installed
 Node.js installed
 Python installed
 Azure subscription selected
 Function App available
 SQL Database available
 Private endpoints approved
 Private DNS configured
 Public access disabled
 VPN connected for private testing
 Function application settings configured
 CORS configured
 Frontend .env configured locally
25. Final Verification

A successful deployment should satisfy all of the following:

Frontend:
Running

Function:
HTTP 200 OK

Database:
Private

SQL Public Access:
Disabled

Function Public Access:
Disabled

Function Private Endpoint:
Approved

SQL Private Endpoint:
Approved

Private DNS:
Working

VPN:
Connected
Conclusion

PrivateVault can be redeployed using the source code and Azure infrastructure documented in this repository.

The deployment process keeps sensitive configuration outside the Git repository while preserving the commands and architecture required to reproduce the system.
