/**
 * @swagger
 * tags:
 *   name: Academics
 *   description: API to get info about the currently logged in user academics. User-level
 *   base-file-route: api/v1/protected/academics/
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Models
const User = require('../models/user.js')

/**
 * @swagger
 * /api/v1/protected/academics:
 *   get:
 *     summary: get the current user's academic info
 *     tags: [Academics]
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
  try {
    const academic_status = await User.get_academics(req.user_id);
    res.json(academic_status[0]);
  } catch (err) {
    console.error('Error fetching academic status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router