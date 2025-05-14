# Discord Integration Setup Guide

This guide walks you through setting up Discord integration for your project. It includes configuring a Discord server, Discord developer application, and necessary GitHub secrets.

---

## 📌 Requirements

Before you begin, ensure you have:

- A Discord server (create a test one if you don't have it)
- A Discord Developer application
- Access to your GitHub repository's **Codespaces** secrets (must be an owner or admin)

---

## 🛠️ Step-by-Step Setup

### 1. Create or Choose a Discord Server

If you don't already have a server:
- Go to Discord and click **Create My Own** to make a new server.

### 2. Copy the Server (Guild) ID

To get your server ID:
1. Open **User Settings** in Discord.
2. Under **Advanced**, enable **Developer Mode**.
3. Right-click your server icon and click **Copy ID**.

Paste this ID into the `DISCORD_SERVER_ID` environment variable in your [`docker-compose.yaml`](../.devcontainer/docker-compose.yaml) file. 
> _Note: Discord refers to servers as "guilds"._

---

### 3. Create Custom Roles

Inside your Discord server:
- Create roles titled: `CIS 115`, `CIS 200`, `CIS 300`
- Right-click each role and choose **Copy ID**
- Paste these IDs into the [`discordRoleIDs`](../server/configs/discordRoleIDs.js) file.

This mapping helps the bot convert course data into usable Discord role IDs to assign to students who are in the course.

---

### 4. Set Up a Discord Developer Application

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a **New Application**
3. Go to the **OAuth2** tab:
   - Select **Bot**
   - Scroll down to **Bot Permissions**
   - Enable **Manage Roles**
   - Enable **Manage Server**
4. Copy the generated URL and paste it into a browser to add the bot to your server

---

## 🔐 GitHub Secrets Setup

You’ll need to set the following **repository secrets** (Found in the Discord app you created):

`DISCORD_CLIENT_ID` 
`DISCORD_CLIENT_SECRET`
`DISCORD_SECRET`

To add these secrets:

1. Go to your GitHub repo
2. Navigate to **Settings → Security → Secrets and variables → Codespaces**
3. Click **New repository secret**
4. Use the exact names listed above and paste in the values from your Discord app

> **Note:** Only repo owners or those with admin access can create secrets.

---

## ✅ Summary

With your Discord server, bot, and GitHub secrets configured, the integration should be ready to go. 
The bot can now:
- Access your server
- Assign roles based on student data
- Verify users through role connections

Users can now:
- Link their Discord account in the profile page

For information regarding Linked-Roles and creating your own Linked-Roles, refer to: [LinkedRolesSetup](../docs/LinkedRolesSetup.md)

For any issues, check the Discord Developer logs or console output in Codespaces.

---