# Project Folder Structure Guide

A quick guide, mostly for other development teams, explaining the folder structure and what each folder contains.

## Legend

- **Folder names** are listed with dashes.
- **Descriptions** follow the folders using bullet points.

---

## `.devcontainer`

- `devcontainer.json`
  - Contains the `postCreateCommand`, which runs once when you first create the Codespace and sets everything up.
- `docker-compose.yaml`
  - Contains all environment variables. If any documentation references a `.env` or environment file, this is the place to look.
- `Dockerfile`
  - Docker configuration.

---

## `Client`

- `.vscode`
  - Autocreated by VS Code. Not manually used.
- `node_modules`
  - Autocreated. Contains installed Node.js modules.
- `public`
  - Contains static assets like the favicon.
- `src`
  - Main source code for the client.

  - `components`
    - `assets`: Images used in the client.
    - `common`: Shared HTML components used across the app.
    - `layout`: Footer and header components.
    - `mixins`: Role-based variables for the client.
    - `styles`: CSS files.

  - `services`
    - Client-to-server communication logic.
    - `tokenApi` must be imported into any store you create.

  - `stores`
    - Manages client-side state and API interactions.

  - `sub-apps`
    - Core functionality of the program.
    - See the sub-app guide for more details.

  - `App.vue`
    - The root component that wraps the entire client.

  - `HomePage.vue`
    - Default landing page.

  - `main.js`
    - Entry point for the Vue application.

  - `reportWebVitals.js`
    - Unused (unknown purpose).

  - `router.js`
    - Client-side routing configuration.

- `tests`
  - Client-side tests.

- `package.json`
  - Project metadata and dependencies.

- `package-lock.json`
  - Dependency versions lock file.

---

## `Server`

- `Configs`
  - Configuration files for various services. Generally shouldn't need to be edited.

- `Database`
  - `Data`: Contains example reports for admin imports.  
    - Includes cleaned enrollment and student reports.
  - `Seeds`: Initial data inserted into the database after Codespace creation.

- `Discord-Bot`
  - Code for running the discord bot

- `Linked-Roles`
  - Helper code for verifying users attempting to claim a Linked Role.
  - `Linked-Roles-Glitch`: Subdirectory for Discord Linked Roles registration.

- `Middleware`
  - Functions attached to routes to control access:
    - `admin-required`: Restricts to admin users.
    - `refreshToken`: Verifies if the login token is still valid.
    - `token`: Confirms that a user is logged in.

- `Migrations`
  - Database schema definitions.
  - Modify to change table structures and fields.

- `Models`
  - Objection.js classes representing DB tables.
  - One class per table.

- `node_modules`
  - Autocreated. Contains installed Node.js modules.

- `Routes`
  - Handles client requests to the server.
  - Entry point: `api.js`, routes are passed to specific files.

- `Tests`
  - Server-side tests.
