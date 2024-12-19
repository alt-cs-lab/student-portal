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
const token = require('../middleware/token.js')
const { dbAudit } = require('../middleware/db-audit.js')
const requestLogger = require('../middleware/request-logger.js')

// Load Routers
const usersRouter = require('./userRoutes.js')
const profileRouter = require('./profileRoutes.js')
const discordRouter = require('./discordRoutes.js')
const githubRouter = require('./githubRoutes.js')
// Load Token Middleware
router.use(token)

// Load DB Audit Middleware
router.use(dbAudit)

// Configure Logging (after token)
router.use(requestLogger)

router.use('/users', usersRouter)
router.use('/profile', profileRouter)
router.use('/discord', discordRouter)
router.use('/github', githubRouter)

//Other routes from the program this api was lifted from, shouldn't be necessary but keeping around just in case.
//router.use('/roles', roleRouter)
//router.use('/platforms', platformsRouter)
//router.use('/courses', coursesRouter)
//router.use('/tools', toolsRouter)
//router.use('/deployments', deploymentRouter)
//router.use('/activities', activitiesRouter)

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