# Discord Linked Roles Setup

> **Before continuing**, ensure that Discord integration is properly set up. View the [README](../README.md) for details.

---

## What Are Linked Roles?

Linked Roles allow us to give users, that request it, a role in our Discord server if they have connected their Discord account to our Student Portal.  
Users who are **not found in our database** will be prompted to connect their accounts.

This acts as **verification** on the Discord Server that a user is connected to the Student Portal, enabling us to **restrict access** to different channels accordingly.

---

## How It Works for Users

When properly set up:

1. Users go to the Discord server.
2. Click the **server name dropdown**.
3. Select **Linked Roles**.
4. Select the Linked Role we setup.
5. They will be redirected to the Student Portal.
6. We verify whether they have connected their Discord account.
7. If they have, they are assigned the role and get the privileges that come with it.

---

## Setup Instructions

### 1. Register the Role Metadata

- Navigate to:  
  [`server/linkedRoles/Linked_Roles_Glitch/src/register.js`](../server/linkedRoles/Linked_Roles_Glitch/src/register.js)

- Ensure the body of the register request looks like this:

  ```js
  const body = [
    {
      key: 'verified',
      name: 'Student Portal Verification',
      description: 'Must be verified by the Student Portal to access the official K-State discord.',
      type: 7,
    },
  ];
  ```

> ⚠️ **Important Note:**  
Metadata is not removed from the Discord server when you re-register.  
If you register a role multiple times, you must **use a unique `key`** each time—otherwise, users will retain their Linked Role from a previous registration.

---

### 2. Run the Registration Script

In a terminal:

```bash
cd server/linkedRoles/Linked_Roles_Glitch/src
node register.js
```

---

### 3. Add your codespace to the Discord App redirect

In the Discord App you created following the [Discord Setup Guide](./DiscordSetup.md):

1. Navigate to the General Information page.
2. Under **Linked Roles Verification URL** add:
```bash
https://{YOUR CODESPACE NAME}-3002.app.github.dev/api/v1/discord/linked-roles
```
3. Replace **{YOUR CODESPACE NAME}** to reflect the codespace you are currently operating in.
4. Save changes.

### 4. Configure the Linked Role in Discord

1. Go to your Discord server.
2. Create a new role.
3. Under the **Links** tab, click **Add requirement**.
4. Under **Apps**, select your `StudentPortalApp`.
5. Toggle the slider to enable the requirement.
6. Set your desired **permissions** and **display settings**.

✅ You have now created a Linked Role!
