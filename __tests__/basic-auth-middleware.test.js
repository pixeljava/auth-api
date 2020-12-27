'use strict';

require('dotenv').config();
// Pull in Supergoose to mock the database
require('@code-fellows/supergoose');
const middleware = require('../src/middleware/basicAuth');
const Users = require('../src/models/users-model');

// Create an admin user
let users = {
  admin: { username: 'admin', password: 'password' },
};

// Pre-load our database with our fake user
beforeAll(async (done) => {
  await new Users(users.admin).save();
  done();
});
// Now our fake DB has a fake admin user

describe('Auth Middleware', () => {
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaZm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {
    it('fails a login for a user (admin) with the incorrect basic credentials', () => {
      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaZm9v',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    it('logs in an admin user with the right credentials', () => {
      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });
    });
  });
});
