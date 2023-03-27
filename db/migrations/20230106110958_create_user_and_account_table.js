/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('Users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('email').unique().notNullable();
    table.timestamps(true, true);
  })
  .createTable('Accounts', function(table) {
    table.increments('id').primary();
    table.string('account_number').unique().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('Users');
    table.integer('balance').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Users').dropTable('Accounts');
};
