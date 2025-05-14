/**
 * @swagger
 * tags:
 *   name: protected
 *   description: Route containing sub routes that require users to be logged in
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
// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const token = require('../middleware/token.js')
const requestLogger = require('../middleware/requestLogger.js')

// Load Routers
const usersRoutes = require('./userRoutes.js')
const profileRoutes = require('./profileRoutes.js')
const applicationsRoutes = require('./applicationRoutes.js')
const academicsRoutes = require('./academicsRoutes.js')
const adminRoutes = require('./adminRoutes.js')
const courseRoutes = require('./courseRoutes.js');
const adminOnly = require('../middleware/adminRequired.js')

//This verifies that the user has logged in before they can access any sub route
router.use(token)

router.use(requestLogger)


router.use('/users', usersRoutes)
router.use('/profile', profileRoutes)
router.use('/applications', applicationsRoutes)
router.use('/academics', academicsRoutes)
router.use('/courses', courseRoutes)
router.use('/admin', adminRoutes, adminOnly)
module.exports = router