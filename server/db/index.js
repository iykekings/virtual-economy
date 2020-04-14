const knex = require('knex');
const config = require('../knexfile')[process.env.NODE_ENV || 'development'];

const db = knex(config);

const getAllUsers = () => db('users');

const getUserByEmail = (email) =>
  db('users').where('email', '=', email).first();

const getAllTransaction = () => db('transactions');

const getUsersTransaction = (userId) =>
  db('transactions')
    .where('donorId', '=', userId)
    .orWhere('receiverId', '=', userId);

const getTransactionById = (id) =>
  db('transactions').where('id', '=', id).first();

const createTransaction = (donorId, receiverId, amount, references) => {
  return knex.transaction(async (trx) => {
    trx('transactions').insert({ donorId, receiverId, amount, references });
    trx('users').where('id', '=', donorId).decrement({
      balance: amount,
    });
    trx('users').where('id', '=', receiverId).increment({
      balance: amount,
    });
  });
};

module.exports = {
  getAllTransaction,
  getUsersTransaction,
  getTransactionById,
  createTransaction,
  getAllUsers,
  getUserByEmail,
};
