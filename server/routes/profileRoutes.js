/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: API to get info about the currently logged in user. User-level
 *   base-file-route: api/v1/protected/profile/
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Models
const User = require('../models/user.js')

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: get the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/', async function (req, res, next) {
  let user = await User.query()
    .findById(req.user_id)
    .select('id', 'email', 'first_name', 'last_name', 'wid')
  res.json(user)
})

/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     summary: update current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: Test Administrator
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/', async function (req, res, next) {
  try {
    await User.query().findById(req.user_id).patch({
      first_name: req.body.user.first_name,
      last_name: req.body.user.last_name,
      profile_updated: true
    })
    res.status(200)
    res.json({ message: 'Profile Saved' })
    /* This error should never be hit */
    /* c8 ignore next 4 */
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router