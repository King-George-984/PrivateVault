# PrivateVault Demo Guide

## 1. Demo Objective

The objective of the PrivateVault demonstration is to prove that:

1. The application is working.
2. The Function App can access Azure SQL.
3. Azure SQL has no public network access.
4. The Function App has no public network access.
5. Private Endpoints are being used.
6. VNet Integration is enabled.
7. Private DNS is resolving private addresses.
8. The React dashboard successfully displays database records.

---

## 2. Demo Architecture

```text
              Administrator Laptop
                       ¦
                       ¦ P2S VPN
                       ?
                Azure Virtual Network
                       ¦
          +-------------------------+
          ¦                         ¦
          ?                         ?
 Function Private Endpoint       Private VM
       10.0.2.4                    10.0.4.4
          ¦
          ?
    Azure Function
          ¦
    VNet Integration
          ¦
          ?
 SQL Private Endpoint
       10.0.2.5
          ¦
          ?
   Azure SQL Database
3. Before the Demo

Verify the following:

Azure Portal is accessible.
Point-to-Site VPN is connected.
Function App is running.
SQL Database is available.
Private endpoints are approved.
Private DNS is configured.
React frontend is running.
Browser can access the dashboard.
4. Start the Frontend

Open PowerShell in the project directory:

cd "C:\Users\jaijo\OneDrive\Desktop\privatevault-frontend"

Start the frontend:

npm run dev

The frontend should be available at:

http://localhost:5174
5. Connect to VPN

Connect to the configured Point-to-Site VPN profile.

The client should receive an address from:

172.16.0.0/24

The VPN provides access to private resources inside:

vnet-serverless
6. Verify Private Function Connectivity

Open PowerShell and run:

Test-NetConnection 10.0.2.4 -Port 443

Expected result:

TcpTestSucceeded : True

This demonstrates that the Function Private Endpoint is reachable through the private network.

7. Verify Private DNS

Run:

[System.Net.Dns]::GetHostAddresses("<FUNCTION-HOSTNAME>")

Expected private address:

10.0.2.4

This demonstrates private hostname resolution.

8. Test the Function API

Run:

curl.exe "https://<FUNCTION-HOSTNAME>/api/users"

Expected result:

HTTP 200

The response should contain the user records retrieved from Azure SQL.

9. Open the Dashboard

Open:

http://localhost:5174

The dashboard should display:

API Status: 200 OK
Database: PRIVATE
Platform: AZURE
Live Users: 5

The user table should contain the records stored in Azure SQL.

10. Dashboard Demonstration

Point out the following sections.

API Status
200 OK

This demonstrates successful communication with the backend.

Database
PRIVATE

This represents the private database architecture.

Live Users

The dashboard displays the number of records retrieved from Azure SQL.

Users Table

The table demonstrates that the Function successfully queried the database.

Security Panel

Point out:

VNet Integration
Function Private Endpoint
SQL Private Endpoint
Public SQL Access
Private DNS
11. Azure Portal Demonstration

Open the Function App:

serverless-project-T049

Navigate to:

Networking

Show:

Public Network Access:
Disabled

Show that VNet Integration is enabled.

Show the Function Private Endpoint:

function-private-endpoint
12. SQL Database Demonstration

Open the Azure SQL resource:

serverlessdb

Open networking settings.

Show:

Public Network Access:
Disabled

Then show:

sql-private-endpoint

with:

Private IP:
10.0.2.5
13. Private DNS Demonstration

Show the Private DNS Zones:

privatelink.azurewebsites.net

privatelink.database.windows.net

Show that they are linked to:

vnet-serverless

Explain that Private DNS allows Azure service hostnames to resolve to private IP addresses.

14. Network Demonstration

Show the VNet:

vnet-serverless
10.0.0.0/16

Then show the subnet layout:

subnet-app
10.0.1.0/24

private-endpoint-subnet
10.0.2.0/24

function-subnet
10.0.3.0/27

vm-subnet
10.0.4.0/24

GatewaySubnet
10.0.5.0/27
15. The Most Important Demo Proof

The strongest proof is the combination of:

Function Public Access:
Disabled

SQL Public Access:
Disabled

Function Private Endpoint:
10.0.2.4

SQL Private Endpoint:
10.0.2.5

API:
HTTP 200 OK

Dashboard:
5 Users

This demonstrates both security configuration and actual functionality.

16. Suggested Presentation Script

Use this explanation:

"PrivateVault is a secure serverless application built on Azure. Our main objective was to allow an Azure Function to access an Azure SQL database without exposing either service through public network access."

Then explain:

"We created an Azure Virtual Network with separate subnets for Function integration, Private Endpoints, the private VM, and the VPN Gateway."

Then:

"The Function App uses VNet Integration for outbound connectivity and a Private Endpoint for private inbound connectivity."

Then:

"Azure SQL also uses a Private Endpoint, and Private DNS resolves the service hostname to the private IP address."

Finally:

"Both the Function App and SQL Database have public network access disabled. The dashboard successfully retrieves five records from the private database and shows an HTTP 200 response."

17. If a Judge Asks: Why Private Endpoint?

Answer:

"A Private Endpoint provides a private IP address for the Azure service inside our VNet. This allows access through private networking instead of exposing the service through a public endpoint."

18. If a Judge Asks: Why VNet Integration?

Answer:

"VNet Integration provides outbound connectivity from the Azure Function into the VNet, allowing the Function to reach private resources such as the SQL Private Endpoint."

19. If a Judge Asks: Why Private DNS?

Answer:

"Private DNS ensures that service hostnames resolve to their private endpoint addresses inside the VNet instead of relying on public DNS resolution."

20. If a Judge Asks: Is the Database Public?

Answer:

"No. Public network access to Azure SQL is disabled. The application accesses it through the SQL Private Endpoint."

21. If a Judge Asks: Is the Function Public?

Answer:

"No. Public network access to the Function App is disabled. Private connectivity is provided through the Function Private Endpoint."

22. If a Judge Asks: How Did You Test It?

Answer:

"We connected through Point-to-Site VPN, verified TCP connectivity to the Function Private Endpoint, verified private DNS resolution, called the Function API, and confirmed an HTTP 200 response containing records from Azure SQL."

23. If a Judge Asks: What Happens If Public Access Is Disabled?

Answer:

"The public path is blocked, but the private path remains available through the VNet, Private Endpoints, Private DNS, and the configured VPN/private connectivity."

24. If a Judge Asks: What Would You Improve for Production?

Answer:

"For production, we would add Azure Key Vault, Managed Identity, Microsoft Entra ID authentication, Application Insights, centralized monitoring, automated CI/CD, and infrastructure-as-code."

25. Demo Failure Checklist
Dashboard says OFFLINE

Check:

VPN connection.
Function hostname resolution.
Function Private Endpoint.
CORS configuration.
Function API.
DNS resolves to a public IP

Check:

VPN connection.
Private DNS zone.
VNet link.
Local DNS configuration.
TCP test fails

Run:

Test-NetConnection 10.0.2.4 -Port 443

Check:

VPN.
Private Endpoint.
VNet routing.
Function networking.
API returns an error

Check:

Function App logs.
SQL application settings.
SQL Private Endpoint.
SQL Private DNS.
Database availability.
Browser shows CORS error

Check:

az functionapp cors show \
  --resource-group rg-serverless-project \
  --name serverless-project-T049 \
  -o json

Ensure:

http://localhost:5174

is included.

26. Final Demo Checklist
Infrastructure
 Resource Group available
 VNet available
 Function App available
 SQL Database available
 Private Endpoints approved
 Private DNS configured
 VPN Gateway available
Security
 Function public access disabled
 SQL public access disabled
 Private VM has no public IP
 Secrets not exposed
Application
 VPN connected
 Frontend running
 API returns HTTP 200
 Dashboard loads
 Five users displayed
27. Closing Statement

"PrivateVault demonstrates how serverless applications can securely access private databases without exposing the database or application backend through public network access. By combining Azure Functions, VNet Integration, Private Endpoints, Private DNS, Azure SQL, and Point-to-Site VPN, we created a working private-by-design serverless architecture."

Conclusion

The PrivateVault demo provides both configuration-level and functional proof.

The Azure Portal demonstrates the private networking configuration, while the working dashboard demonstrates successful application-to-database communication.

Together, these demonstrate the complete PrivateVault architecture.
