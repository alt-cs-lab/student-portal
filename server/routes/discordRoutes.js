/**
 * @swagger
 * tags:
 *   name: Discord
 *   description: API to connect with a user's Discord account. User-level
 *   base-file-route: /api/v1/discord
 */

// Load Libraries
const express = require('express')
const router = express.Router()
const axios = require('axios');
const qs = require('qs');
const db = require('../configs/db.js')
const crypto = require('crypto')
const discord = require('../linkedRoles/discord.js')
const storage = require('../linkedRoles/storage.js')
const discordbot = require('../discordBot/discordbot.js');
const { setDefaultAutoSelectFamily } = require('net');

/* Discord */
router.get('/', async (req,res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const userId = req.query.state;
  res.redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${process.env.SERVER_URL}%2Fapi%2Fv1%2Fdiscord%2Fcallback&scope=identify&state=${userId}`)
})

router.delete('/', async (req,res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await db('user_discord').where('user_id', userId).del();
    res.status(200).json({ message: 'Entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting entries:', error);
    res.status(500).json({ error: 'Failed to delete entries' });
  }
})
router.get('/callback', async (req, res) => {
  console.log('here we are')
  const { code } = req.query;

  const data = qs.stringify({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    code: code,
    redirect_uri: `${process.env.SERVER_URL}/api/v1/discord/callback`,
    grant_type: 'authorization_code',
  });

  try {
    const response = await axios.post('https://discord.com/api/oauth2/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    const userData = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userData.data;
    const id = req.query.state;
    await db('user_discord')
      .insert({
        user_id: id,
        discord_id: user.id, 
        username: user.username, 
      })
      .onConflict('user_id')
      .merge();

    res.redirect(`${process.env.CAS_SERVICE_URL}/profile`)
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/linked-roles', async (req,res) => {
    const state = crypto.randomUUID();
    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID);
    url.searchParams.set('redirect_uri', `${process.env.SERVER_URL}/api/v1/discord/role-callback`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'role_connections.write identify');
    url.searchParams.set('prompt', 'consent');
    res.cookie('clientState', state, { maxAge: 1000 * 60 * 5, signed: true });
    res.redirect(url);
})

router.get('/role-callback', async(req, res) => {
  try {
    // 1. Uses the code and state to acquire Discord OAuth2 tokens
    const code = req.query['code'];
    const discordState = req.query['state'];

    // make sure the state parameter exists
    const { clientState } = req.signedCookies;
    if (clientState !== discordState) {
      console.error('State verification failed.');
      return res.sendStatus(403);
    }

    const tokens = await discord.getOAuthTokens(code);

    // 2. Uses the Discord Access Token to fetch the user profile
    const meData = await discord.getUserData(tokens);
    const userId = meData.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'Discord user Id was not found' });
    }
    try {
      const result = await db('user_discord').where('discord_id', userId).first();
      if(!result){
        return res.status(404).send(`
          <html>
            <head>
              <title>User Not Found</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  text-align: center;
                  padding: 50px;
                }
                h1 {
                  color: #482277;
                }
                p {
                  font-size: 18px;
                }
                a {
                  color: #007bff;
                  text-decoration: none;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <h1>User Not Found</h1>
              <p>We couldn't find your account in our database.</p>
              <p>Please visit the <a href="${process.env.CAS_SERVICE_URL}/profile">Student Portal</a> website and link your discord account to your profile.</p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error when looking for a discord user in the database.' });
    }
    await storage.storeDiscordTokens(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    // 3. Update the users metadata, assuming future updates will be posted to the `/update-metadata` endpoint
    await discord.updateMetadata(userId);

    res.send('You did it!  Now go back to Discord.');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})
router.get('/username', async (req,res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  try {
    const result = await db('user_discord').where('user_id', userId).first();
    res.json({ username: result.username });
  } catch (error) {
    res.json({ username: '' });
  }
})
// Used to refresh all discord roles then returns true if successfull.
router.post('/refreshDiscordRoles', async function (req, res, next) {
  try {
    const result = discordbot.handleAllStudentRoles();
    res.json({result: true});
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
    res.json(false);
  }
})
// Used to refresh specific student of all discord roles and then returns true if successfull. 
router.post('/refreshStudentRoles', async function (req, res, next) {
  try {
    const discordID = req.body.user;
    await discordbot.handleSelectStudentRoles(discordID);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
    res.json(false);
  }
})
  
module.exports = router