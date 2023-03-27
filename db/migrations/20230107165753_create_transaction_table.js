/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('Transactions', function(table) {
        table.increments('id').unique().primary();
        table.string('sender_account_number').notNullable();
        table.foreign('sender_account_number').references('account_number').inTable('Accounts');
        table.string('reciever_account_number').notNullable();
        table.foreign('reciever_account_number').references('account_number').inTable('Accounts');
        table.integer('sender_id').unsigned().notNullable();
        table.foreign('sender_id').references('id').inTable('Users');
        table.integer('reciever_id').unsigned().notNullable();
        table.foreign('reciever_id').references('id').inTable('Users');
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
  return knex.schema.dropTable('Transactions');
};
