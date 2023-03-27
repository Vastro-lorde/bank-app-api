/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Transactions').del()
  await knex('Transactions').insert([
    { id: 1, sender_account_number: '198765432', reciever_account_number: '198765432', transaction_type: 'credit', sender_id: 2, reciever_id: 2, amount: 0 },
    { id: 2, sender_account_number: '198765432', reciever_account_number: '198765432', transaction_type: 'debit', sender_id: 2, reciever_id: 2, amount: 0},
    { id: 3, sender_account_number: '123456789', reciever_account_number: '123456789', transaction_type: 'credit', sender_id: 1, reciever_id: 1, amount: 0 },
    { id: 4, sender_account_number: '123456789', reciever_account_number: '123456789', transaction_type: 'debit', sender_id: 1, reciever_id: 1, amount: 0 },
    { id: 5, sender_account_number: '123456789', reciever_account_number: '198765432', transaction_type: 'transfer', sender_id: 1, reciever_id: 2, amount: 0 }
  ]);
};
