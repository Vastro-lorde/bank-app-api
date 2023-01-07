module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.GCP_DB_HOST,
      user: process.env.GCP_DB_USER,
      password: process.env.GCP_DB_PASSWORD,
      database: 'wallet_test '
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
