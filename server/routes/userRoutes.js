/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin level API to get information about all users
 *   base-file-route: /api/v1/protected/users/
 */

// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../middleware/adminRequired.js')

// Load Models
const User = require('../models/user.js')

//API routes to get information about all stored users.
//Admin access only.

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: <admin> list all the users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', adminOnly, async function (req, res, next) {
  let users = {}
    users = await User.query()
    .select('users.id', 'users.email', 'users.first_name', 'users.last_name')
    .withGraphFetched('roles')
  
  res.json(users)
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *   post:
 *     summary: <admin> update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: user ID
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             first_name: Test
 *             last_name: Administrator
 *             roles:
 *               - id: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from roles
    const roles = req.body.user.roles.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await User.query().upsertGraph(
      {
        id: req.params.id,
        first_name: req.body.user.first_name,
        last_name: req.body.user.last_name,
        roles: roles,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'User Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     summary: <admin> create user
 *     tags: [Users]
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
 *             email: test-admin
 *             first_name: Test
 *             last_name: Administrator
 *             roles:
 *               - id: 1
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from roles
    const roles = req.body.user.roles.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await User.query().upsertGraph(
      {
        email: req.body.user.email,
        first_name: req.body.user.first_name,
        last_name: req.body.user.last_name,
        roles: roles,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(201)
    res.json({ message: 'User Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: <admin> delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: user ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/UpdateError'
 */
router.delete('/:id', adminOnly, async function (req, res, next) {
  if (req.params.id == req.user_id) {
    res.status(422)
    res.json({ error: 'Cannot Delete Yourself' })
  } else {
    try {
      var deleted = await User.query().deleteById(req.params.id)
      if (deleted === 1) {
        res.status(200)
        res.json({ message: 'User Deleted' })
      } else {
        res.status(422)
        res.json({ error: 'User Not Found' })
      }
      /* This error should be impossible to hit */
      /* c8 ignore next 4 */
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  }
})

module.exports = router