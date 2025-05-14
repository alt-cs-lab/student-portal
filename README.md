# CS Professional Applications System
Welcome to the Professional Applications System, a capstone project currently being developed by [Josh Riddle](https://github.com/jriddle11), [Ethan Jones](https://github.com/Kalithar) and [Luke Moeller](https://github.com/LukeCMoeller).  
  
**Previous contributors:**  
[Jake Houghton](https://github.com/J-Houghton)  
[Josh Munda](https://github.com/josh-munda)  
[Nathan York](https://github.com/nafemage)  
[Zach Berard](https://github.com/zmberard)  

## Table of Contents

* [Description](#description)
* [Getting Started](#getting-started)
* [GitHub Integration](#github-integration)
* [Discord Integration](#discord-integration)
* [Features](#features)
* [Contributing](#contributing)
* [License](#license)

## Description
 This application is designed to replace the current professional program application while retaining its core functionality and introducing new features. It helps students track their pre-professional and professional program GPA, monitor the status of their professional program application, and access information about their advisor and degree progress. Additionally, it streamlines the application process by allowing students to auto-fill their professional program applications.

 New features include a student profile where students can connect their Discord and GitHub accounts, as well as a modular design that allows for the addition of new components and sub-applications as needed. Once completed, the project will be maintained by K-State CIS faculty and staff.

 The client was built with Vue.js and the server utilizes Express and PostgreSQL. [Link to Database Tables](docs/diagrams/Database_Schema.pdf)

## Getting Started

### **Prerequisites** 
* Software required
    * Node.js (version 16/18 or higher)

### **Running the Project**  
1. Start a codespace.
2. Wait a couple of minutes for the codespace to build AND for the postcreate command to complete.

#### **Server Side**  
- If the postcreate command did not run, install dependencies:  
  ```sh
  cd server && npm install
  ```
- Ensure the environment variables are set in the [docker-compose](.devcontainer/docker-compose.yaml) file.
- In the server directory, run the server:  
  ```sh
  npm run dev
  ```

#### **Database**  
- If the postcreate command did not run, run database migrations and seed data:  
  ```sh
  cd server && knex migrate:latest --knexfile configs/knexfile.js && knex seed:run --knexfile configs/knexfile.js
  ```

#### **Client Side**  
- Open a new terminal
- If the postcreate command did not run, install dependencies:  
  ```sh
  cd client && npm install
  ```
- In the client directory, run the client:  
  ```sh
  npm run dev
  ```

#### **Login**
- Login as test admin:  
Username: **admin**  
Password: **password**  

- Login as test student:  
Username: **student**  
Password: **password**  

- Login as test reviewer:  
Username: **reviewer**  
Password: **password**  

- Login as test struggling student:  
Username: **struggle**  
Password: **password**

Save your profile information  

## GitHub Integration 
1. First you must setup a GitHub developer application, refer to these instructions: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app
2. Navigate to https://github.com/settings/developers and select the application you created.
3. Navigate to the General tab.
4. Set the Homepage URL and Authorization Callback URL to reflect your current codespace url.

  Homepage URL:
  ```sh
  https://{YOUR CODESPACE NAME}-5173.app.github.dev
  ```
  Authorization Callback URL:
  ```sh
  https://{YOUR CODESPACE NAME}-3002.app.github.dev/github/callback
  ```
5. Update application
6. Navigate to your repository Settings page (you must be an owner or admin).
7. Navigate to Security -> Secrets and Variables -> Codespaces.
8. Add your GitHub App's client ID as HUBGIT_CLIENT_ID.
9. Add your GitHub App's secret as HUBGIT_CLIENT_SECRET.


## Discord Integration
1. You will need to have or create a Discord server and a Discord bot, follow these instructions for initial setup: [Discord setup](./docs/DiscordSetup.md)
2. Navigate to https://discord.com/developers/applications and select your application.
3. Navigate to the OAuth2 tab.
4. Add these redirects to the Redirects section and ensure they reflect your current codespace url.
  ```sh
  https://{YOUR CODESPACE NAME}-3002.app.github.dev/discord/callback
  ```
  ```sh
  https://{YOUR CODESPACE NAME}-3002.app.github.dev/discord/role-callback
  ```
5. Save changes.

## Discord Linked Roles
Refer to this document for setting up Linked Roles: [Discord Linked Roles Setup](./docs/LinkedRolesSetup.md).
 
# Features
## System Features
  - Intergrated KSU Single Sign-On/Central Authencation System to ensure seamless intergration and enhanced security.  
 - CORS Protection
 - Page Authorization Protection 
 - SQL Injection Protection 

## Admin Features
  - Customized tables for better readability and functionality: 
    - Sortable Columns
    - Filterable Columns
    - Item per page
    - Pagination
  - Modal components with student specific data  
  - Data export
  - Email with template


## Student Features 
  - Auto Populating student data to mininze input
  - Animated background and loading page to enhance UX 
  - Profile customization
  - Discord Integration
  - GitHub Integration

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

The routes of this project are heavily influenced from Russell Feldhausen. Mr. Feldhausen allowed us to use inspiration from 'officehours-node' program to complete with the routes.

## License

Copyright © Microsoft Corporation All rights reserved.<br />
Licensed under the MIT License. See LICENSE in the project root for license information.
