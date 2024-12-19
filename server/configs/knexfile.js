let config = null

if (process.env.NODE_ENV === 'test') {
  config = {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
  }
} else {
  config = {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || 5432, 10)
    },
    migrations: {
      tableName: 'migrations',
      directory: '../migrations'
    },
    seeds: {
      directory: '../seeds'
    },
  }
}

module.exports = config