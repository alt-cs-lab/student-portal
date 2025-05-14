/**
 * @swagger
 * tags:
 *   name: API
 *   description: API
 * components:
 *   responses:
 *     UpdateError:
 *       description: error accepting submitted data
 *     Success:
 *       description: success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

//Base api file, sets up the rest of the apis and routes to them

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const { dbAudit } = require('../middleware/dbAudit.js')
const requestLogger = require('../middleware/requestLogger.js')

// Load Routes
const protectedRoutes = require('./protectedRoutes.js')
const authRoutes = require('./authRoutes.js')
const githubRoutes = require('./githubRoutes.js')
const discordRoutes = require('./discordRoutes.js')

// Load DB Audit Middleware
router.use(dbAudit)

router.use(requestLogger)

//Routing
router.use('/protected', protectedRoutes) //This route is for any sub route that requires authentication
router.use('/auth', authRoutes) //This route is for authenticating users
router.use('/github', githubRoutes)
router.use('/discord', discordRoutes)

/**
 * @swagger
 * /api/v1/:
 *   get:
 *     summary: list API version and user info
 *     tags: [API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API version and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: number
 *                   format: float
 *                 user_id:
 *                   type: integer
 *                 is_admin:
 *                   type: integer
 *             example:
 *               version: 1.0
 *               user_id: 1
 *               is_admin: 1
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

module.exports = router