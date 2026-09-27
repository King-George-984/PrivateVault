# PrivateVault Networking Guide

## 1. Overview

PrivateVault uses Azure Virtual Network and Azure Private Link to create private communication paths between the application components.

The networking architecture prevents direct public access to the Function App and Azure SQL Database.

---

## 2. Virtual Network

```text
VNet:
vnet-serverless

Address Space:
10.0.0.0/16

Region:
East Asia

The VNet provides the private network boundary for the PrivateVault infrastructure.

3. Subnet Layout
10.0.0.0/16
¦
+-- 10.0.1.0/24
¦   +-- subnet-app
¦
+-- 10.0.2.0/24
¦   +-- private-endpoint-subnet
¦
+-- 10.0.3.0/27
¦   +-- function-subnet
¦
+-- 10.0.4.0/24
¦   +-- vm-subnet
¦
+-- 10.0.5.0/27
    +-- GatewaySubnet
4. Subnet Purposes
Subnet    CIDR    Purpose
subnet-app    10.0.1.0/24    Existing application subnet
private-endpoint-subnet    10.0.2.0/24    Private Link endpoints
function-subnet    10.0.3.0/27    Function VNet Integration
vm-subnet    10.0.4.0/24    Private VM
GatewaySubnet    10.0.5.0/27    VPN Gateway
5. Function VNet Integration

The Azure Function uses:

Subnet:
function-subnet

CIDR:
10.0.3.0/27

The subnet is delegated to:

Microsoft.App/environments

VNet Integration provides outbound connectivity from the Function App into the VNet.

6. Function Private Endpoint

The Function App has a Private Endpoint:

Name:
function-private-endpoint

Subnet:
private-endpoint-subnet

Private IP:
10.0.2.4

The Private Endpoint provides private inbound connectivity.

The Function App's public network access is disabled.

7. SQL Private Endpoint

Azure SQL uses:

Name:
sql-private-endpoint

Subnet:
private-endpoint-subnet

Private IP:
10.0.2.5

The SQL Server's public network access is disabled.

The Function communicates with SQL through this private endpoint.

8. Private Endpoint Flow
Azure Function
      ¦
      ¦ VNet Integration
      ?
Azure VNet
      ¦
      ?
SQL Private Endpoint
      ¦
      ¦ 10.0.2.5
      ?
Azure SQL Database
9. Private DNS

Private DNS is required so that Azure service hostnames resolve to private endpoint IP addresses.

PrivateVault uses:

privatelink.azurewebsites.net
privatelink.database.windows.net

Both DNS zones are linked to:

vnet-serverless
10. Function DNS Resolution

The Function hostname resolves through the private DNS configuration.

Example private address:

10.0.2.4

The private DNS path is:

Function Hostname
       ¦
       ?
Private DNS Zone
       ¦
       ?
10.0.2.4
11. SQL DNS Resolution

The SQL hostname:

serverlessdb.database.windows.net

uses the SQL Private DNS configuration.

The private endpoint resolves to:

10.0.2.5

Flow:

serverlessdb.database.windows.net
             ¦
             ?
Private DNS
             ¦
             ?
         10.0.2.5
12. Point-to-Site VPN

The administrator connects to the Azure VNet using Point-to-Site VPN.

VPN Gateway:
privatevault-vpn-gateway

SKU:
VpnGw1AZ

Client Address Pool:
172.16.0.0/24

Protocols:
IkeV2
OpenVPN

The VPN provides controlled access to private VNet resources.

13. VPN Network Flow
Administrator Laptop
        ¦
        ¦ P2S VPN
        ?
VPN Gateway
        ¦
        ?
Azure VNet
        ¦
        +-- Function Private Endpoint
        ¦
        +-- SQL Private Endpoint
        ¦
        +-- Private VM
14. Private VM

The private VM is located in:

Subnet:
vm-subnet

Private IP:
10.0.4.4

No public IP address is required.

The VM is used for private connectivity testing.

15. Connectivity Test

The Function Private Endpoint was tested using:

Test-NetConnection 10.0.2.4 -Port 443

Successful result:

TcpTestSucceeded : True

This confirms TCP connectivity to the Function Private Endpoint.

16. Function API Test

The Function API was tested through its hostname:

https://<FUNCTION-HOSTNAME>/api/users

Successful response:

HTTP 200

The response contained the user records stored in Azure SQL.

17. DNS Verification

Windows hostname resolution was tested using:

[System.Net.Dns]::GetHostAddresses("<FUNCTION-HOSTNAME>")

The private endpoint address returned was:

10.0.2.4

This confirmed that the local system was resolving the Function hostname through the private path.

18. Why Hostname-Based Access Is Used

Azure App Service and Azure Functions use hostname-based routing and TLS/SNI.

Therefore, accessing the Function using:

https://10.0.2.4

is not equivalent to accessing:

https://<FUNCTION-HOSTNAME>

The correct test uses the Function hostname, which allows the platform to identify the correct application.

19. Security Boundaries

PrivateVault has the following network boundaries:

Internet
   ¦
   ¦ Public access disabled
   X
   ¦
Azure VNet
   ¦
   +-- Private Function Endpoint
   ¦
   +-- Private SQL Endpoint
   ¦
   +-- Private VM
   ¦
   +-- VPN Gateway
20. End-to-End Private Data Path
React Dashboard
      ¦
      ?
Function Private Endpoint
      ¦
      ?
Azure Function
      ¦
      ¦ VNet Integration
      ?
Azure VNet
      ¦
      ?
SQL Private Endpoint
      ¦
      ?
Azure SQL Database
      ¦
      ?
Users Table
21. Network Security Controls
Control    Configuration
Function public access    Disabled
SQL public access    Disabled
Function Private Endpoint    Enabled
SQL Private Endpoint    Enabled
Function VNet Integration    Enabled
Private DNS    Enabled
VPN    Enabled
Private VM public IP    None
22. Troubleshooting
Function cannot be reached

Check:

VPN connection.
Private DNS resolution.
Function Private Endpoint state.
Function public access configuration.
TCP port 443 connectivity.
SQL connection fails

Check:

SQL Private Endpoint.
SQL Private DNS zone.
SQL public access configuration.
Function VNet Integration.
Function application settings.
SQL credentials.
Browser shows CORS error

Verify the Function App CORS configuration:

http://localhost:5174

Check using:

az functionapp cors show \
  --resource-group rg-serverless-project \
  --name serverless-project-T049 \
  -o json
23. Final Network State
VNet:
10.0.0.0/16

Function Private Endpoint:
10.0.2.4

SQL Private Endpoint:
10.0.2.5

Private VM:
10.0.4.4

VPN Client Pool:
172.16.0.0/24

The final implementation successfully demonstrated private communication between the Function App and Azure SQL Database.

Conclusion

PrivateVault uses Azure networking services to minimize public exposure and establish controlled private connectivity.

The combination of VNet Integration, Private Endpoints, Private DNS, and Point-to-Site VPN provides the network foundation for the secure serverless architecture.
