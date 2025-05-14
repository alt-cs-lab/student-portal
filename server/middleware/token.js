// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

const jwt = require('jsonwebtoken')
// Load Models
const User = require('../models/user')
const Role = require('../models/role.js')

// Load Logger
const logger = require('../configs/logger.js')

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    logger.debug('Token is null')
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    // console.log(err)

    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.sendStatus(401)
      } else {
        logger.warn('API Token Parse Error - ' + err)
        return res.sendStatus(403)
      }
    }

    req.user_id = user.user_id
    req.user_email = user.email

    try {
      // Fetch the user by ID using the User model
      const user = await User.query().findById(req.user_id);
    
      if (!user) {
        logger.error('User not found');
        return res.status(404).send('User not found');
      }
    
      // Supplies the users roles/permissions
      const roles = await user.get_roles();
      req.roles = roles;
    
      // Continue with the request
      next();
    
    } catch (error) {
      logger.error('Error checking user roles: ' + error);
      return res.status(500).send('Internal Server Error');
    }
  });
}

module.exports = authenticateToken