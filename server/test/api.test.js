const request = require('supertest');
const app = require('../server');
const DB = require('../db');

describe('GET /', () => {
  it('responds correctly', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'Api exposed at /api' }, done);
  });
});

describe('GET api/users/:email', () => {
  it('fetches users details correctly', (done) => {
    request(app)
      .get('/api/users/jon@doe.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        res.body.firstName = 'Jon';
        res.body.lastName = 'Doe';
        res.body.email = 'jon@done.com';
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('fails to fetch for unregistered user', (done) => {
    request(app)
      .get('/api/users/unkown@some.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, { message: 'User not rgeistered' }, done);
  });
});

describe('GET /api/transactions/:userId', () => {
  it('fetches users transactions correctly', async (done) => {
    const { id } = await DB.getUserByEmail('jon@doe.com');
    request(app)
      .get('/api/transactions/' + id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /api/transactions/:userId', () => {
  it('fetches users transactions correctly', async (done) => {
    const { id } = await DB.getUserByEmail('jon@doe.com');
    request(app)
      .get('/api/transactions/' + id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
