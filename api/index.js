const router = require('express').Router();
const paykey = 'sk_test_9a8b0b3232890a5764e2806551959146235ac70d';
const DB = require('../db');

router.get('/transaction/:userId', async (req, res) => {});

router.post('/transaction', async (req, res) => {});

router.get('/users/:userId', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await DB.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
});

module.exports = router;