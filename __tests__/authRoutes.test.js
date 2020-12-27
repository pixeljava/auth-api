'use strict';

require('dotenv').config();
const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/middleware/bearerAuth');

const mockRequest = supergoose(server);

let users = {
  user:   { username: 'user',   password: 'password', 'capabilities': ['read'] },
  writer: { username: 'writer', password: 'password', 'capabilities': ['read', 'create'] },
  editor: { username: 'editor', password: 'password', 'capabilities': ['read', 'create', 'update'] },
  admin:  { username: 'admin',  password: 'password', 'capabilities': ['read', 'create', 'update', 'delete'] },
};

describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {
    describe(`${userType} users`, () => {
      it(`can create an ${userType}`, async () => {
        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;

        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
      });

      it(`${userType} can signin with basic`, async () => {
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
      });

      it(`${userType} can signin with bearer`, async () => {
        // First, use basic to login to get a token
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);
        const token = response.body.token;
        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer ${token}`);
        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);
      });
    });
  }); // End Object.keys

  describe('bad logins', () => {
    it('basic fails with known user and wrong password', async () => {
      const response = await mockRequest.post('/signin')
        .auth('admin', 'passrsowd');
      const userObject = response.body;
      expect(response.status).toBe(500);
      expect(userObject.user).not.toBeDefined();
      expect(userObject.token).not.toBeDefined();
    });

    it('basic fails with unknown user', async () => {
      const response = await mockRequest.post('/signin')
        .auth('nobody', 'xyz');
      const userObject = response.body;

      expect(response.status).toBe(403);
      expect(userObject.user).not.toBeDefined();
      expect(userObject.token).not.toBeDefined();
    });

    it('bearer fails with an invalid token', async () => {
      // First, use basic to login to get a token
      const bearerResponse = await mockRequest
        .get('/users')
        .set('Authorization', `Bearer foobar`);
      // Not checking the value of the response, only that we "got in"
      expect(bearerResponse.status).toBe(403);
    });
  });
});
