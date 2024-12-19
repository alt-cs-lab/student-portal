const session = require('express-session')
const {ConnectSessionKnexStore} = require('connect-session-knex')
const knex = require('./db');

const knexStore = new ConnectSessionKnexStore({
    knex,
    tablename: "sessions",
  });
  
const dbSession = session({
    // We want a unique session secret for the application, 
    // ideally stored as an environment variable.
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    store: knexStore,
    // resave forces the session to be written back to the 
    // session store when no changes have been made
    resave: false,
    // saveUninitialized allows new and unmodified sessions
    // to be saved to the session store.  Since we're using 
    // the username to determine login status, `true` is fine.
    saveUninitialized: true,
    // Cookie-specific settings
    cookie: { 
      // secure requires the client to be using https
      secure: false
    }
  });

module.exports = dbSession;