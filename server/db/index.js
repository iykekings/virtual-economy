const knex = require('knex');
const config = require('../knexfile')[process.env.NODE_ENV || 'development'];

const db = knex(config);

const getAllUsers = () => db('users');

const getUserByEmail = (email) =>
  db('users').where('email', '=', email).first();

const getAllTransaction = () => db('transactions');

const getUsersTransactions = (userId) =>
  db('transactions')
    .where('donorId', '=', userId)
    .orWhere('receiverId', '=', userId);

const getTransactionById = (id) =>
  db('transactions').where('id', '=', id).first();

// strictly for testing purposes
const updateUserBalanceByEmail = (email, balance) =>
  db('users').where({ email }).update({ balance });

const creditUser = (email, amount) =>
  db('users').where('email', email).increment({ balance: amount });

const createTransaction = async (donorId, receiverId, amount) => {
  const trx = await db.transaction();
  try {
    const trans = await trx('transactions').insert({
      donorId,
      receiverId,
      amount,
    });
    await trx('users').where('id', '=', donorId).decrement({
      balance: amount,
    });
    await trx('users').where('id', '=', receiverId).increment({
      balance: amount,
    });
    await trx.commit();
    return trans;
  } catch (e) {
    await trx.rollback();
  }
};

module.exports = {
  getAllTransaction,
  getUsersTransactions,
  getTransactionById,
  createTransaction,
  getAllUsers,
  getUserByEmail,
  updateUserBalanceByEmail,
  creditUser,
};
