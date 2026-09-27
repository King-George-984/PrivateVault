# ?? PrivateVault
## Secure Serverless Access on Azure

PrivateVault is a secure serverless application designed to access a private Azure SQL database through Azure networking services without exposing the database or Function App through public network access.

The project demonstrates how a serverless application can use Azure Functions, VNet Integration, Private Endpoints, Private DNS, Azure SQL Database, and Point-to-Site VPN to create a private and controlled application architecture.

---

## ?? Problem Statement

Modern serverless applications often need to access databases containing sensitive information. Exposing the database through a public endpoint increases the attack surface.

PrivateVault addresses this problem by creating a private communication path between the application and database.

### Key Requirements

- Access Azure SQL privately from an Azure Function.
- Disable public access to the database.
- Disable public access to the Function App.
- Use VNet Integration for outbound Function connectivity.
- Use Private Endpoints for private inbound connectivity.
- Use Private DNS for internal name resolution.
- Provide secure private access for administrators through Point-to-Site VPN.
- Provide a web dashboard for viewing database records.

---

## ??? Architecture

```text
                         Administrator
                              ¦
                         Point-to-Site
                              ¦
                              ?
                    +------------------+
                    ¦    Azure VNet    ¦
                    ¦   10.0.0.0/16    ¦
                    +------------------+
                             ¦
              +-----------------------------+
              ¦                             ¦
              ?                             ?
     Function Private Endpoint        Private VM
          10.0.2.4                    10.0.4.4
              ¦
              ?
      Azure Function App
       Flex Consumption
              ¦
        VNet Integration
              ¦
              ?
      SQL Private Endpoint
          10.0.2.5
              ¦
              ?
        Azure SQL Database
           serverlessd
