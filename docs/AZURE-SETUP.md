# Azure Setup Guide

## 1. Overview

This document describes the Azure resources created for the PrivateVault project.

The deployment uses Microsoft Azure services to provide a secure private serverless architecture.

---

## 2. Resource Group

```text
Resource Group:
rg-serverless-project

Region:
East Asia

All major PrivateVault resources are deployed inside this resource group.

3. Virtual Network
Name:
vnet-serverless

Address Space:
10.0.0.0/16

Region:
East Asia

The Virtual Network provides the private network boundary for the application.

4. Subnets

The following subnets were created:

Subnet    Address Prefix    Purpose
subnet-app    10.0.1.0/24    Existing application subnet
private-endpoint-subnet    10.0.2.0/24    Azure Private Endpoints
function-subnet    10.0.3.0/27    Azure Function VNet Integration
vm-subnet    10.0.4.0/24    Private VM
GatewaySubnet    10.0.5.0/27    VPN Gateway
Function subnet delegation

The Function subnet is delegated to:

Microsoft.App/environments

This is required for the Flex Consumption networking configuration.

5. Azure Function App
Function App:
serverless-project-T049

Hosting Plan:
Flex Consumption

Runtime:
Python 3.13

Region:
East Asia

Memory:
512 MB

The Function App provides the backend API for PrivateVault.

HTTP endpoint:

/api/users
6. Function Networking

The Function App uses outbound VNet Integration.

Integration Subnet:
function-subnet

Address:
10.0.3.0/27

Public network access is disabled.

A private endpoint was created for inbound private access.

7. Function Private Endpoint
Name:
function-private-endpoint

Subnet:
private-endpoint-subnet

Private IP:
10.0.2.4

Connection State:
Approved

This provides private access to the Function App from the VNet.

8. Azure SQL Database
Server:
serverlessdb.database.windows.net

Database:
serverlessdb

Service Tier:
General Purpose Serverless

Maximum vCores:
2

Storage:
32 GB

The database stores the application user records.

9. SQL Private Endpoint
Name:
sql-private-endpoint

Subnet:
private-endpoint-subnet

Private IP:
10.0.2.5

Connection State:
Approved

The SQL Server uses the private endpoint for VNet connectivity.

10. SQL Public Access

Public network access is disabled.

SQL Public Network Access:
Disabled

This ensures that database access occurs through the private networking configuration.

11. Private DNS

Two Private DNS Zones are used.

Function App DNS
privatelink.azurewebsites.net

Linked VNet:

vnet-serverless
SQL DNS
privatelink.database.windows.net

Linked VNet:

vnet-serverless

Private DNS allows service hostnames to resolve to private IP addresses.

12. Point-to-Site VPN

A VPN Gateway was configured for secure administrator access.

Gateway:
privatevault-vpn-gateway

SKU:
VpnGw1AZ

VPN Type:
RouteBased

Region:
East Asia
Client address pool
172.16.0.0/24
Supported protocols
IkeV2
OpenVPN

The VPN allows an authorized client to access private resources inside the VNet.

13. VPN Gateway Subnet

The VPN Gateway uses:

GatewaySubnet
10.0.5.0/27

The subnet is reserved for the VPN Gateway.

14. Private VM

A private Ubuntu VM was created for network testing.

Name:
privatevault-demo

OS:
Ubuntu Server 24.04 LTS

Subnet:
vm-subnet

Private IP:
10.0.4.4

Public IP:
None

The VM was used to test connectivity to the private Function endpoint.

15. Function Application Settings

The Function App uses application settings for database connectivity.

The following configuration variables are used:

SQL_SERVER
SQL_DATABASE
SQL_USERNAME
SQL_PASSWORD

The actual password is stored only in Azure Function configuration and is never stored in the Git repository.

16. CORS Configuration

The React development frontend runs on:

http://localhost:5174

The Function App allows this origin through its CORS configuration.

Configured origins include:

https://portal.azure.com
http://localhost:5174

CORS allows the browser-based React dashboard to communicate with the Function API.

17. Resource Relationship
Resource Group
¦
+-- VNet
¦   +-- subnet-app
¦   +-- private-endpoint-subnet
¦   +-- function-subnet
¦   +-- vm-subnet
¦   +-- GatewaySubnet
¦
+-- Function App
¦   +-- function-private-endpoint
¦
+-- Azure SQL
¦   +-- sql-private-endpoint
¦
+-- Private DNS Zones
¦
+-- VPN Gateway
¦
+-- Private VM
18. Important Security Settings

Final security configuration:

Resource    Public Access
Azure Function App    Disabled
Azure SQL Database    Disabled
Private VM    No public IP
SQL Private Endpoint    Enabled
Function Private Endpoint    Enabled
Private DNS    Enabled
VPN    Enabled
19. Verification

The following tests were successfully performed.

Function Private Endpoint
10.0.2.4:443

Connectivity succeeded through the VNet/VPN path.

Function API
HTTP 200 OK

The API successfully returned database records.

SQL connectivity

The Function successfully connected to:

serverlessdb.database.windows.net

through the private networking configuration.

Dashboard

The React dashboard successfully displayed five user records.

20. Azure Deployment Result

The final Azure architecture contains:

1 Resource Group
1 Virtual Network
5 subnets
1 Flex Consumption Function App
1 Azure SQL Database
2 Private Endpoints
2 Private DNS Zones
1 VPN Gateway
1 Private VM

The resources work together to provide a secure private serverless application architecture.

21. Notes for Future Deployment

Before rebuilding the project:

Create the Resource Group.
Create the VNet.
Create the required subnets.
Register required Azure resource providers.
Create the Flex Consumption Function App.
Configure VNet Integration.
Create the Azure SQL Database.
Create the SQL Private Endpoint.
Create the Function Private Endpoint.
Configure Private DNS.
Disable public access.
Configure the VPN Gateway.
Deploy the Function code.
Configure Function application settings.
Configure CORS.
Deploy the React frontend.
Test private connectivity.
Conclusion

The Azure environment for PrivateVault was designed so that the Function App and Azure SQL Database communicate through private Azure networking while public access remains disabled.

This setup provides a practical demonstration of secure serverless application architecture using Azure Private Link, VNet Integration, Private DNS, and Point-to-Site VPN.
