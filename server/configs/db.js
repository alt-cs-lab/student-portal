var Knex = require('knex')
const config = require('./knexfile');

let db = Knex(config)

module.exports = db