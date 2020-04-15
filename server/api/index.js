const router = require('express').Router();
const DB = require('../db');

router.get('/transactions/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await DB.getUsersTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/users/credit', async (req, res) => {
  const { email, amount } = req.body;
  if (email && amount) {
    try {
      const user = await DB.getUserByEmail(email);
      if (user.id) {
        const credit = await DB.creditUser(user.email, amount);
        return res.status(201).json({ message: credit });
      } else {
        return res.status(404).json({ message: 'user not registered' });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  return res.status(400).json({ message: 'Provide email and amount fields' });
});

router.post('/transactions', async (req, res) => {
  const { donorEmail, receiverEmail, amount } = req.body;
  if (donorEmail && receiverEmail && amount) {
    try {
      const donor = await DB.getUserByEmail(donorEmail);
      if (donor.balance >= amount) {
        const receiver = await DB.getUserByEmail(receiverEmail);
        const trans = await DB.createTransaction(donor.id, receiver.id, amount);
        return res.status(201).json({ message: trans });
      }
      return res
        .status(400)
        .json({ message: "You don't have enough money. Recharge first" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  return res
    .status(400)
    .json({ message: 'Provide donorEmail, receiverEmail & amount fields' });
});

router.get('/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await DB.getUserByEmail(email);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: 'User not rgeistered' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
