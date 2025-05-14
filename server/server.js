//TODO: Update all http to https address, local env was not set up correctly. 
const express = require('express');
const cors = require('cors');
const logger = require('./configs/logger.js');
const util = require('node:util');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const session = require('./configs/session.js');
const serverConfig = require('./configs/server');
const knex = require('./configs/db');
const passport = require('passport');
const crypto = require('crypto')

const discord = require('./discordBot/discordbot.js');

const app = express();
const PORT = serverConfig.port || 3001;

app.set('knex', knex);

app.disable('etag');

app.use(express.json());

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Middleware
const corsConfig = require('./middleware/corsConfig');
app.use(corsConfig);

// Cookie Parsing
const app_secret = crypto.randomBytes(16).toString('hex')
app.use(cookieParser(app_secret));

// Routes
const apiRoutes = require('./routes/api.js');

app.use('/api/v1', apiRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  logger.error('404: ' + req.url + ' : ' + req.originalUrl)
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  logger.error(util.inspect(err))
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app