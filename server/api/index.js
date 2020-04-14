const router = require('express').Router();
// const paykey = 'sk_test_9a8b0b3232890a5764e2806551959146235ac70d';
// const paystack = require('paystack')(paykey);
const DB = require('../db');

router.get('/transactions/:userId', async (req, res) => {});

router.post('/users/credit', async (req, res) => {
  const { email, amount } = req.body;
  if (email && amount) {
    try {
      const user = await DB.getUserByEmail(email);
      if (user.id) {
        const credit = await DB.creditUser(user.email, amount);
        res.status(201).json({ message: credit });
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
        res.status(201).json({ message: trans });
      }
      return res
        .status(400)
        .json({ message: "You don't have enough money. Recharge first" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
});

router.get('/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await DB.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
