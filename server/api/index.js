const router = require('express').Router();
const paykey = 'sk_test_9a8b0b3232890a5764e2806551959146235ac70d';
const paystack = require('paystack')(paykey);
const DB = require('../db');

router.get('/transactions/:userId', async (req, res) => {});

router.post('/transactions', async (req, res) => {
  const { donorId, receiverId, amount, references } = req.params;
  if (donorId && receiverId && amount && references) {
    try {
    } catch (error) {}
  }
});

router.get('/users/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email);
  try {
    const user = await DB.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;