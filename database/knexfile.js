// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      host:      "localhost",
      port:      5432,
      user:     'username',
      password: 'password'
    }
  },

  testing: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      host:     "localhost",
      port:     5432,
      user:     'username',
      password: 'password'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      host:     "localhost",
      port:     5432,
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      host:     "localhost",
      port:     5432,
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
