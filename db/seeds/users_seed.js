/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Users').del()
  await knex('Users').insert([
    {id: 1, name: 'Seun Daniel Omatsola', email: 'omatsolaseund@gmail.com', password: 'love'},
    {id: 2, name: 'Ibukun Blessing Omatsola', email: 'ibukunblessing@gmail.com', password: 'love'}
  ]);
};
