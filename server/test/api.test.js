const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('responds correctly', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'Api exposed at /api' }, done);
  });
});
