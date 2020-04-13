const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (_, res) => {
  res.json({ message: 'Api exposed at /api' });
});

module.exports = server;
