/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Accounts').del()
  await knex('Accounts').insert([
    {id: 1, account_number: '123456789', user_id: 1, balance: 980000},
    {id: 2, account_number: '198765432', user_id: 2, balance: 980000}
  ]);
};
