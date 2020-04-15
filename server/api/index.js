const router = require('express').Router();
const Axios = require('axios').default;
const seckey = 'sk_test_9a8b0b3232890a5764e2806551959146235ac70d';
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
  const { email, amount, reference } = req.body;
  if (email && amount) {
    if (process.env.NODE_ENV !== 'test' && !reference)
      return res.status(400).json({ message: 'Provide payment reference' });

    try {
      // verfiy payment from paystack
      if (process.env.NODE_ENV !== 'test') {
        const verify = await Axios.get(
          'https://api.paystack.co/transaction/verify/' + reference,
          { headers: { Authorization: 'Bearer ' + seckey } }
        );
        if (!verify.data.status)
          return res.status(400).json({
            message: 'Failed to confirm payment, check with your bank',
          });
      }

      const user = await DB.getUserByEmail(email);
      if (user) {
        await DB.creditUser(user.email, amount);
        return res.status(201).json({ message: 'successfully credited' });
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
      if (!donor) {
        return res
          .status(404)
          .json({ message: 'Donor not registered, Try signing up first' });
      }
      if (donor.balance >= amount) {
        const receiver = await DB.getUserByEmail(receiverEmail);
        if (!receiver) {
          return res.status(404).json({ message: 'Receiver not registered' });
        }
        // check if donor is himself
        if (receiver.email === donor.email) {
          return res.status(400).json({ message: 'Cannot transfer to self' });
        }
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
