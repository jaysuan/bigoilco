module.exports = {

  local: {
    client: 'mysql',
    connection: {
      database: 'bigoilco',
      user:     'root',
      password: process.env.DB_PASSWORD,
      host: 'localhost'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'bigoilco',
      user:     'root',
      password: process.env.DB_PASSWORD,
      socketPath: process.env.DB_SOCKET_PATH
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'bigoilco',
      user:     'root',
      password: process.env.DB_PASSWORD,
      socketPath: process.env.DB_SOCKET_PATH
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
