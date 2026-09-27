# PrivateVault Security Guide

## 1. Security Overview

PrivateVault is designed around the principle of minimizing public network exposure.

The primary security objective is to allow the Azure Function App to communicate with Azure SQL Database through private Azure networking while keeping public access disabled.

The architecture uses multiple security layers:

- Azure Virtual Network
- Private Endpoints
- VNet Integration
- Private DNS
- Point-to-Site VPN
- Restricted public access
- Application-level secret configuration
- Git secret protection

---

## 2. Security Architecture

```text
                    Public Internet
                          ¦
                          ¦
                 Public access disabled
                          X
                          ¦
                    Azure VNet
                          ¦
             +-------------------------+
             ¦                         ¦
             ?                         ?
     Function Private Endpoint   SQL Private Endpoint
          10.0.2.4                   10.0.2.5
             ¦                         ¦
             ?                         ?
       Azure Function            Azure SQL Database
3. Function App Security

The Function App is configured with:

Public Network Access:
Disabled

Private Endpoint:
Enabled

VNet Integration:
Enabled

This prevents normal public access to the Function App.

The Function can still be accessed through the configured private networking path.

4. SQL Database Security

Azure SQL Database is configured with:

Public Network Access:
Disabled

Private Endpoint:
Enabled

The SQL Database therefore does not rely on a public network endpoint for application communication.

5. Private Endpoints

Private Endpoints provide private IP addresses for Azure services.

Function Private Endpoint
Name:
function-private-endpoint

Private IP:
10.0.2.4
SQL Private Endpoint
Name:
sql-private-endpoint

Private IP:
10.0.2.5

The endpoints are located inside:

private-endpoint-subnet
10.0.2.0/24
6. VNet Integration

The Function App uses VNet Integration through:

function-subnet
10.0.3.0/27

This provides outbound connectivity from the Function App into the VNet.

The Function can therefore reach private resources such as the SQL Private Endpoint.

7. Private DNS Security

Private DNS prevents applications inside the VNet from needing to use public endpoint addresses for the private services.

Private DNS zones:

privatelink.azurewebsites.net
privatelink.database.windows.net

The zones are linked to:

vnet-serverless
8. VPN Security

Point-to-Site VPN provides controlled administrator access.

Configuration:

VPN Gateway:
privatevault-vpn-gateway

Client Address Pool:
172.16.0.0/24

Protocols:
IkeV2
OpenVPN

The VPN provides a secure encrypted connection between an authorized client and the Azure VNet.

9. Private VM Security

The test VM:

privatevault-demo

uses:

Private IP:
10.0.4.4

The VM does not have a public IP address.

SSH access uses key-based authentication.

Private keys must never be committed to GitHub.

10. Database Credentials

The Function App requires database configuration:

SQL_SERVER
SQL_DATABASE
SQL_USERNAME
SQL_PASSWORD

The password is stored as an Azure Function Application Setting.

The SQL password is not stored in:

React source code
Git repository
README
Documentation
Frontend .env committed to Git
11. Frontend Security

The React frontend only requires the Function API URL.

Example:

VITE_API_URL=https://<function-hostname>/api/users

The frontend must never contain:

SQL_USERNAME
SQL_PASSWORD
VPN private keys
Azure access tokens
Database connection strings containing passwords
12. Git Security

Sensitive files are excluded through .gitignore.

The repository excludes:

.env
*.b64
*.cer
*.pfx
*.key
*.pem
privatevault-dist.zip

This prevents local secrets and certificates from accidentally being committed.

13. Files That Must Never Be Committed

Never commit:

.env

or:

PrivateVaultP2SRoot.b64
PrivateVaultP2SRoot.cer

Also never commit:

*.pfx
*.key
*.pem

or any file containing private credentials.

14. CORS Security

The Function App uses explicit CORS origins.

Configured development origin:

http://localhost:5174

The configuration avoids allowing all origins with:

*

Specific origins should be used whenever possible.

For production deployment, replace the development origin with the actual production frontend domain.

15. TLS

The Function API is accessed using HTTPS:

https://<function-hostname>/api/users

HTTPS protects data while it is transported between the client and Function App.

The Azure SQL connection also uses encryption:

Encrypt=yes

and:

TrustServerCertificate=no
16. Defense in Depth

PrivateVault uses multiple security controls rather than relying on a single mechanism.

Layer 1
¦
+-- Azure VNet
¦
Layer 2
¦
+-- Private Endpoints
¦
Layer 3
¦
+-- VNet Integration
¦
Layer 4
¦
+-- Private DNS
¦
Layer 5
¦
+-- Public Access Disabled
¦
Layer 6
¦
+-- Point-to-Site VPN
¦
Layer 7
¦
+-- Application Secret Protection
17. Security Verification

The following settings were verified during implementation.

Function App
Public Network Access:
Disabled

Private Endpoint:
Approved

VNet Integration:
Enabled
Azure SQL
Public Network Access:
Disabled

Private Endpoint:
Approved
Private VM
Public IP:
None
DNS
Private DNS:
Configured
VPN
Point-to-Site VPN:
Configured
18. Connectivity Verification

The private Function endpoint was tested using:

Test-NetConnection 10.0.2.4 -Port 443

Successful result:

TcpTestSucceeded : True

The Function API returned:

HTTP 200 OK

The dashboard successfully retrieved the database records.

19. Security Limitations

The current implementation is a working academic/hackathon prototype.

For production deployment, additional controls should be considered:

Azure Key Vault
Managed Identity
Microsoft Entra ID authentication
Role-Based Access Control
Web Application Firewall
Application Insights
Azure Monitor
Microsoft Defender for Cloud
Network Security Groups where appropriate
Automated security scanning
Centralized logging
Secret rotation
Production certificate management
20. Recommended Production Improvements
Managed Identity

Replace SQL username/password authentication with Managed Identity where supported.

Azure Key Vault

Store secrets and certificates in Azure Key Vault.

Microsoft Entra ID

Use Microsoft Entra ID for administrator and application authentication.

Monitoring

Enable:

Azure Monitor
Application Insights
Log Analytics
CI/CD

Use GitHub Actions with securely stored deployment credentials or federated identity.

21. Security Checklist

Before committing:

 .env is ignored
 SQL password is not in source code
 VPN private key is not committed
 Certificates are not committed
 Azure tokens are not committed
 API keys are not committed

Before deployment:

 SQL public access disabled
 Function public access disabled
 Private endpoints approved
 Private DNS configured
 VPN configured
 HTTPS enabled
 CORS restricted to required origins
Conclusion

PrivateVault demonstrates a private-by-design serverless architecture.

The system reduces public exposure by disabling public access to the Function App and Azure SQL Database and using Azure private networking technologies.

The architecture provides a strong foundation for extending the prototype into a production-ready secure application.
