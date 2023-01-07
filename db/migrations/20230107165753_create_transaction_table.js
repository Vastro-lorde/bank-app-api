/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex
    .createTable('Account', function(table) {
        table.increments('id').unique().primary();
        table.string('account_number').unique().notNullable();
        table.integer('sender_id').unsigned().notNullable();
        table.foreign('sender_id').references('id').inTable('User');
        table.integer('reciever_id').unsigned().notNullable();
        table.foreign('reciever_id').references('id').inTable('User');
        table.integer('amount').notNullable();
        table.string('transaction_type').notNullable();
        table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable();
};
