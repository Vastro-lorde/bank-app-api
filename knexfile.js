
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/database/wallet.db3'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    useNullAsDefault: true
  }
};
