const server = require('.');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('App running at http://localhost:' + PORT);
});
