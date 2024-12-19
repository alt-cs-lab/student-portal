const jwt = require('jsonwebtoken')
const logger = require('../configs/logger.js')
const User = require('../models/user.js')

async function refreshToken(req, res, next) {
  const refresh_token = req.cookies['refresh_token']
  if (refresh_token == null) {
    logger.debug('refresh-token: Token is null')
    return next()
  }
  jwt.verify(refresh_token, process.env.TOKEN_SECRET, async (err, token) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        logger.debug('refresh-token: Token expired')
        return next()
      } else {
        logger.debug('refresh-token: Token verification error')
        logger.debug(err)
        return next()
      }
    }
    const user = await User.query().findById(token.user_id)
    if (!user) {
      logger.debug('refresh-token: User not found')
      return next()
    }
    if (user.refresh_token !== token.refresh_token) {
      logger.debug('refresh-token: Refresh token mismatch')
      return next()
    }
    logger.debug('refresh-token: Token refreshed for user ' + user.email)
    req.session.user_id = user.id
    return next()
  })
}

module.exports = refreshToken