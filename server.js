const express = require('express');
const server = express();
const transRouter = require('./api');

server.use(express.json());
server.route('/api', transRouter);

server.get('/', (_, res) => {
  res.json({ message: 'Api exposed at /api' });
});

module.exports = server;
