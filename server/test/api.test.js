const request = require('supertest');
const app = require('../server');
const DB = require('../db');
const assert = require('assert');

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
      .then((res) => {
        assert.equal(res.body.firstName, 'Jon');
        assert.equal(res.body.lastName, 'Doe');
        assert.equal(res.body.email, 'jon@doe.com');
        done();
      })
      .catch((err) => done(err));
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

describe('POST /api/users/credit', () => {
  it('Successfully credits users wallet balance', async (done) => {
    const { balance } = await DB.getUserByEmail('jon@doe.com');
    request(app)
      .post('/api/users/credit/')
      .set('Accept', 'application/json')
      .send({ email: 'jon@doe.com', amount: 500 })
      .expect('Content-Type', /json/)
      .expect(201, { message: 'successfully credited' })
      .then(async () => {
        try {
          const user = await DB.getUserByEmail('jon@doe.com');
          assert.equal(user.balance, balance + 500);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('Fails to credit unregistered user', (done) => {
    request(app)
      .post('/api/users/credit/')
      .set('Accept', 'application/json')
      .send({ email: 'unknown@example.com', amount: 500 })
      .expect('Content-Type', /json/)
      .expect(404, { message: 'user not registered' }, done);
  });
  it('Fails when required fields are not provided', (done) => {
    request(app)
      .post('/api/users/credit/')
      .set('Accept', 'application/json')
      .send({ amount: 500 })
      .expect('Content-Type', /json/)
      .expect(400, { message: 'Provide email and amount fields' }, done);
  });
});

describe('POST /api/transactions', () => {
  it('Successfully tranfers money from one', async (done) => {
    await DB.creditUser('jon@doe.com', 1000);
    const jonBefore = await DB.getUserByEmail('jon@doe.com');
    const samBefore = await DB.getUserByEmail('sam@smith.com');
    request(app)
      .post('/api/transactions')
      .set('Accept', 'application/json')
      .send({
        donorEmail: jonBefore.email,
        receiverEmail: samBefore.email,
        amount: 500,
      })
      .expect(201)
      .then(async () => {
        try {
          const jonAfter = await DB.getUserByEmail('jon@doe.com');
          const samAfter = await DB.getUserByEmail('sam@smith.com');
          assert.equal(jonBefore.balance - 500, jonAfter.balance);
          assert.equal(samBefore.balance + 500, samAfter.balance);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
  it('Fails if donor balance is insufficient', async (done) => {
    await DB.updateUserBalanceByEmail('jon@doe.com', 0);
    const jonBefore = await DB.getUserByEmail('jon@doe.com');
    const samBefore = await DB.getUserByEmail('sam@smith.com');
    request(app)
      .post('/api/transactions')
      .set('Accept', 'application/json')
      .send({
        donorEmail: jonBefore.email,
        receiverEmail: samBefore.email,
        amount: 500,
      })
      .expect(400, { message: "You don't have enough money. Recharge first" })
      .then(async () => {
        try {
          const jonAfter = await DB.getUserByEmail('jon@doe.com');
          const samAfter = await DB.getUserByEmail('sam@smith.com');
          assert.equal(
            jonBefore.balance,
            jonAfter.balance,
            'Balance should not change after invalid transfer'
          );
          assert.equal(
            samBefore.balance,
            samAfter.balance,
            'Balance should not change after invalid transfer'
          );
          done();
        } catch (error) {
          done(error);
        }
      });
  });
  it('Fails on missing important fields', (done) => {
    request(app)
      .post('/api/transactions')
      .set('Accept', 'application/json')
      .send({
        receiverEmail: 'sam@smith.com',
        amount: 500,
      })
      .expect(
        400,
        { message: 'Provide donorEmail, receiverEmail & amount fields' },
        done
      );
  });
  it('Fails on unregistered donor', (done) => {
    request(app)
      .post('/api/transactions')
      .set('Accept', 'application/json')
      .send({
        donorEmail: 'unregistered@him.com',
        receiverEmail: 'sam@smith.com',
        amount: 500,
      })
      .expect(
        404,
        { message: 'Donor not registered, Try signing up first' },
        done
      );
  });
  it('Fails on unregistered receiver', async (done) => {
    await DB.creditUser('sam@smith.com', 1000);
    request(app)
      .post('/api/transactions')
      .set('Accept', 'application/json')
      .send({
        donorEmail: 'sam@smith.com',
        receiverEmail: 'unregistered@him.com',
        amount: 500,
      })
      .expect(404, { message: 'Receiver not registered' }, done);
  });
});
