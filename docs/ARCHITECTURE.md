# PrivateVault Architecture

## 1. Overview

PrivateVault is a secure serverless architecture built on Microsoft Azure.

The system allows an Azure Function App to access an Azure SQL Database through private networking while public network access is disabled.

The architecture combines:

- Azure Functions Flex Consumption
- Azure Virtual Network
- VNet Integration
- Private Endpoints
- Private DNS
- Azure SQL Database
- Point-to-Site VPN
- Private Virtual Machine
- React frontend

---

## 2. High-Level Architecture

```text
                         User / Administrator
                                ¦
                                ¦ Point-to-Site VPN
                                ?
                    +------------------------+
                    ¦      Azure VNet        ¦
                    ¦      10.0.0.0/16       ¦
                    +------------------------+
                                ¦
             +------------------+------------------+
             ¦                  ¦                  ¦
             ?                  ?                  ?
      Private Endpoint     Azure Function       Private VM
          10.0.2.4        Flex Consumption       10.0.4.4
             ¦                  ¦
             ¦                  ¦ VNet Integration
             ¦                  ?
             ¦           SQL Private Endpoint
             ¦               10.0.2.5
             ¦                  ¦
             +------------------¦
                                ?
                         Azure SQL Database
                            serverless@'
# PrivateVault Architecture

## 1. Overview

PrivateVault is a secure serverless architecture built on Microsoft Azure.

The system allows an Azure Function App to access an Azure SQL Database through private networking while public network access is disabled.

The architecture combines:

- Azure Functions Flex Consumption
- Azure Virtual Network
- VNet Integration
- Private Endpoints
- Private DNS
- Azure SQL Database
- Point-to-Site VPN
- Private Virtual Machine
- React frontend

---

## 2. High-Level Architecture

```text
                         User / Administrator
                                ¦
                                ¦ Point-to-Site VPN
                                ?
                    +------------------------+
                    ¦      Azure VNet        ¦
                    ¦      10.0.0.0/16       ¦
                    +------------------------+
                                ¦
             +------------------+------------------+
             ¦                  ¦                  ¦
             ?                  ?                  ?
      Private Endpoint     Azure Function       Private VM
          10.0.2.4        Flex Consumption       10.0.4.4
             ¦                  ¦
             ¦                  ¦ VNet Integration
             ¦                  ?
             ¦           SQL Private Endpoint
             ¦               10.0.2.5
             ¦                  ¦
             +------------------¦
                                ?
                         Azure SQL Database
                            serverlessdb
3. Resource Group
Resource Group:
rg-serverless-project

Region:
East Asia

The resource group contains the Azure resources required by PrivateVault.

4. Virtual Network
Name:
vnet-serverless

Address Space:
10.0.0.0/16

Region:
East Asia

The VNet provides the private network boundary for the application infrastructure.

5. Subnet Design
Subnet    Address Range    Purpose
subnet-app    10.0.1.0/24    Existing application subnet
private-endpoint-subnet    10.0.2.0/24    Private endpoints
function-subnet    10.0.3.0/27    Function VNet Integration
vm-subnet    10.0.4.0/24    Private VM
GatewaySubnet    10.0.5.0/27    VPN Gateway
Function subnet

The Function subnet is delegated to:

Microsoft.App/environments

This subnet is used for outbound VNet integration from the Flex Consumption Function App.

Private endpoint subnet

The private endpoint subnet contains the private IP addresses used by Azure Private Link.

6. Azure Function
Function App:
serverless-project-T049

Plan:
Flex Consumption

Runtime:
Python 3.13

Region:
East Asia

The Function exposes an HTTP endpoint:

/api/users

The endpoint connects to Azure SQL and returns user records as JSON.

7. Function VNet Integration

The Function App uses:

function-subnet
10.0.3.0/27

VNet Integration provides outbound connectivity from the Function App into the VNet.

The Function can therefore communicate with private resources such as the SQL Private Endpoint.

8. Function Private Endpoint

The Function App has a Private Endpoint:

Name:
function-private-endpoint

Private IP:
10.0.2.4

Subnet:
private-endpoint-subnet

Public network access to the Function App is disabled.

The Private Endpoint provides private inbound connectivity to the Function App.

9. Azure SQL Database
Server:
serverlessdb.database.windows.net

Database:
serverlessdb

Tier:
General Purpose Serverless

Maximum vCores:
2

Storage:
32 GB

The SQL Database is used to store the application user records.

10. SQL Private Endpoint

The SQL Server has a Private Endpoint:

Name:
sql-private-endpoint

Private IP:
10.0.2.5

Subnet:
private-endpoint-subnet

Public network access to the SQL Server is disabled.

The Function communicates with SQL using the private endpoint.

11. Private DNS

PrivateVault uses Azure Private DNS Zones:

privatelink.azurewebsites.net

privatelink.database.windows.net

The DNS zones are linked to:

vnet-serverless

Private DNS allows Azure service hostnames to resolve to private IP addresses.

Example:

Function hostname
        ¦
        ?
Private DNS
        ¦
        ?
10.0.2.4

SQL:

serverlessdb.database.windows.net
        ¦
        ?
Private DNS
        ¦
        ?
10.0.2.5
12. Point-to-Site VPN

A Point-to-Site VPN is configured for secure administrator access.

VPN Gateway:
privatevault-vpn-gateway

SKU:
VpnGw1AZ

Client Address Pool:
172.16.0.0/24

Protocols:
IkeV2
OpenVPN

The VPN allows an authorized administrator to connect from a client device to resources inside the VNet.

13. Private VM

A private Ubuntu VM is used for network testing.

Name:
privatevault-demo

Subnet:
vm-subnet

Private IP:
10.0.4.4

Operating System:
Ubuntu Server 24.04 LTS

The VM does not require a public IP address.

It was used to verify:

Private DNS resolution
Function private endpoint connectivity
HTTP API response
Private network routing
14. Complete Data Flow

The application request follows this logical flow:

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
Private DNS Resolution
       ¦
       ?
SQL Private Endpoint
       ¦
       ?
Azure SQL Database
       ¦
       ?
Users Table
       ¦
       ?
JSON Response
       ¦
       ?
React Dashboard
15. Network Security Model

PrivateVault uses layered network controls:

                Public Internet
                       ¦
                 Public Access
                       X
                       ¦
                +------?------+
                ¦ Azure VNet  ¦
                +-------------+
                       ¦
             +-------------------+
             ¦                   ¦
             ?                   ?
      Function PE            SQL PE
       10.0.2.4              10.0.2.5
             ¦                   ¦
             ?                   ?
       Azure Function       Azure SQL

Public network access is disabled for both the Function App and SQL Server.

16. Connectivity Proof

The private network was successfully tested.

Function Private Endpoint:

10.0.2.4

SQL Private Endpoint:

10.0.2.5

The Function API returned:

HTTP 200 OK

The React dashboard successfully displayed five user records.

This demonstrates successful end-to-end communication through the configured Azure architecture.

17. Architecture Benefits

The architecture provides:

Reduced public exposure
Private database connectivity
Private Function App access
Controlled administrator access
Private DNS resolution
Segmented network design
Serverless backend
Scalable application architecture
18. Future Architecture Improvements

Potential improvements include:

Azure Key Vault
Managed Identity
Microsoft Entra ID
Application Insights
Azure Monitor
GitHub Actions CI/CD
Infrastructure as Code using Bicep or Terraform
Web Application Firewall
Production domain
Automated security monitoring
Conclusion

PrivateVault demonstrates a practical secure serverless architecture on Azure where application components communicate using private networking rather than relying on public database access.

The combination of Azure Functions, VNet Integration, Private Endpoints, Private DNS, Azure SQL, and Point-to-Site VPN provides a strong foundation for a private serverless application.
