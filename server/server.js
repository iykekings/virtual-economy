const express = require('express');
const cors = require('cors');
const server = express();
const transRouter = require('./api');

server.use(cors());
server.use(express.json());
server.use('/api', transRouter);

server.get('/', (_, res) => {
  res.json({ message: 'Api exposed at /api' });
});

module.exports = server;
