/**
 * @swagger
 * tags:
 *   name: GitHub
 *   description: GitHub API
 */

// Load Libraries
const express = require('express')
const router = express.Router()
const axios = require('axios');
const qs = require('qs');
const db = require('../configs/db.js')
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.HUBGIT_CLIENT_ID,
      clientSecret: process.env.HUBGIT_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/github/callback`   //process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

router.get('/', (req, res, next) => {
    const userId = req.query.state;
  
    passport.authenticate('github', {
      scope: ['user:email'],
      state: userId 
    })(req, res, next);
  });
  router.delete('/', async (req,res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      await db('user_github').where('user_id', userId).del();
      res.status(200).json({ message: 'Entries deleted successfully' });
    } catch (error) {
      console.error('Error deleting entries:', error);
      res.status(500).json({ error: 'Failed to delete entries' });
    }
  })
  router.get('/callback', passport.authenticate('github', { failureRedirect: '/' }), async (req, res) => {
      await db('user_github')
        .insert({
          user_id: req.query.state,
          github_id: req.user.id, 
          username: req.user.username, 
          profile_url: req.user.profileUrl
        })
        .onConflict('user_id')
        .merge();
      res.redirect(`${process.env.CAS_SERVICE_URL}/profile`)
    }
  );
  router.get('/username', async (req,res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
  
    try {
      const result = await db('user_github').where('user_id', userId).first();
      res.json({ username: result.username });
    } catch (error) {
      res.json({ username: '' });
    }
  })
  


module.exports = router