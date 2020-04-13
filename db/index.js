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

const addTransaction = (transaction) =>
  db('transactions')
    .insert(transaction)
    .then(([id]) => getTransactionById(id));

module.exports = {
  getAllTransaction,
  getUsersTransaction,
  addTransaction,
  getAllUsers,
  getUserByEmail,
};
