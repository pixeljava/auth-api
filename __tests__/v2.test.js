'use strict';

// Testing Requirements

// Assert the following for all V2 Routes
//  V2 (Authenticated) Routes
//     404 on a bad route
//     404 on a bad method
//     The correct status codes and returned data for EACH api route, for EACH user type:
//         Create a record using POST
//           Succeeds for: writer, editor, admin
//           Fails for: user
//         Read a list of records using GET
//           Succeeds for: user, writer, editor, admin
//           Fails for: <nobody>
//         Read a record using GET
//           Succeeds for: user, writer, editor, admin
//           Fails for: <nobody>
//         Update a record using PUT
//           Succeeds for: editor, admin
//           Fails for: user, writer
//         Destroy a record using DELETE
//           Succeeds for: admin
//           Fails for: user, writer, editor

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const { it, expect } = require('@jest/globals');
const mockRequest = supergoose(server);

xdescribe('The V2 web server API', () => {
  // Throw 403 on any unauthenticated access to the V2 api
  it('gives a 403 any unauthenticated access to the V2 api', async () => {
    const response = await mockRequest.put('/api/v2/burritos');
    expect(response.status).toBe(404);
  });
});

xdescribe('The V2 taco API routes', () => {
  let users = {
    user:   { username: 'user',   password: 'password', 'capabilities': ['read'] },
    writer: { username: 'writer', password: 'password', 'capabilities': ['read', 'create'] },
    editor: { username: 'editor', password: 'password', 'capabilities': ['read', 'create', 'update'] },
    admin:  { username: 'admin',  password: 'password', 'capabilities': ['read', 'create', 'update', 'delete'] },
  };
  Object.keys(users).forEach(userType => {
    // Store our taco ids once created for reuse later.
    let tacoOneId;
    let tacoTwoId;

    // Create a record using POST
    it(`correctly posts a new taco as ${userType}`, async () => {
      const requiredACL = 'create';
      // First create the user
      const createResponse = await mockRequest.post('/signup').send(users[userType]);
      const userObject = createResponse.body;
      
      // First, use bearer to login to get a token
      const response = await mockRequest.post('/signin')
        .auth(users[userType].username, users[userType].password);
      console.log('uO:', response.body);
      const token = response.body.token;
      users[userType].token = token;
      console.log('token', token);
      // Send over taco number one...
      const postObject1 = { 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco' };
      const postResponse1 = mockRequest
        .post('/api/v2/tacos')
        .set('Authorization', `Bearer ${token}`)
        .send(postObject1);
      console.log('pr1', postResponse1.body);
      tacoOneId = postResponse1.body._id;
      if (users[userType].capabilities.includes(requiredACL)) {
        expect(postResponse1.body).toStrictEqual(
          { '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0 },
        );
      } else {
        console.log(`${userType} failed to ${requiredACL} a taco. They had these capabilities: `, users[userType].capabilities);
        expect(postResponse1.status).toBe(403);
      }
    });
    // Read a list of records using GET
    xit(`returns all taco records as ${userType}`, async () => {
      // Send over taco number two...
      const postObject2 = { 'name': 'Soft Shell (Yellow Corn)', 'type': 'Regular Taco' };
      const postResponse2 = await mockRequest
        .post('/api/v2/tacos')
        .set('Authorization', `Bearer ${users[userType].token}`)
        .send(postObject2);
      tacoTwoId = postResponse2.body._id;
      // Get both our stored tacos...
      const getAllResponse = await mockRequest.get('/api/v2/tacos');
      expect(getAllResponse.body).toStrictEqual(
        [
          { '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0 },
          { '_id': tacoTwoId, 'name': 'Soft Shell (Yellow Corn)', 'type': 'Regular Taco', '__v': 0 },
        ],
      );
    });
    // Read a record using GET
    xit(`returns a specific taco by id as ${userType}`, async () => {
      const response = await mockRequest
        .get(`/api/v2/tacos/${tacoOneId}`)
        .set('Authorization', `Bearer ${users[userType].token}`);
      expect(response.body).toStrictEqual(
        { 
          '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0,
        },
      );
    });
    // Update a record using PUT
    xit(`correctly updates a new taco as ${userType}`, async () => {
      const putObject = { 'name': 'Soft Shell (White Corn)', 'type': 'Regular Soft Taco' };
      const putResponse = await mockRequest
        .put(`/api/v2/tacos/${tacoTwoId}`)
        .set('Authorization', `Bearer ${users[userType].token}`)
        .send(putObject);
      expect(putResponse.body).toStrictEqual(
        { '_id': tacoTwoId, 'name': 'Soft Shell (White Corn)', 'type': 'Regular Soft Taco', '__v': 0 },
      );
    });
    // Destroy a record using DELETE
    xit(`correctly deletes a taco as ${userType}`, async () => {
      const deleteResponse1 = await mockRequest
        .set('Authorization', `Bearer ${users[userType].token}`)
        .delete(`/api/v2/tacos/${tacoOneId}`);
      expect(deleteResponse1.status).toBe(200);
      const deleteResponse2 = await mockRequest
        .set('Authorization', `Bearer ${users[userType].token}`)
        .delete(`/api/v2/tacos/${tacoTwoId}`);
      expect(deleteResponse2.status).toBe(200);
    });
  }); // End User's forEach
}); // End V2 Tacos Routes


xdescribe('The V2 drink API routes', () => {
  // Store our drink ids once created for reuse later.
  let drinkOneId;
  let drinkTwoId;

  // Create a record using POST
  it('correctly posts a new drink', async () => {
    // Send over drink number one...
    const postObject1 = { 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml' };
    const postResponse1 = await mockRequest.post('/api/v2/drinks').send(postObject1);
    drinkOneId = postResponse1.body._id;
    expect(postResponse1.body).toStrictEqual(
      { '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0 },
    );
  });
  // Read a list of records using GET
  it('returns all drink records', async () => {
    // Send over drink number two...
    const postObject2 = { 'name': 'Cafe Bien Hoa Tan', 'type': 'Hot Instant Coffee', 'size': '150ml' };
    const postResponse2 = await mockRequest.post('/api/v2/drinks').send(postObject2);
    drinkTwoId = postResponse2.body._id;
    // Get both our stored drinks...
    const getAllResponse = await mockRequest.get('/api/v2/drinks');
    expect(getAllResponse.body).toStrictEqual(
      [
        { '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0 },
        { '_id': drinkTwoId, 'name': 'Cafe Bien Hoa Tan', 'type': 'Hot Instant Coffee', 'size': '150ml', '__v': 0 },
      ],
    );
  });
  // Read a record using GET
  it('returns a specific drink by id', async () => {
    const response = await mockRequest.get(`/api/v2/drinks/${drinkOneId}`);
    expect(response.body).toStrictEqual(
      { 
        '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0,
      },
    );
  });
  // Update a record using PUT
  it('correctly updates a new drink', async () => {
    const putObject = { 'name': 'Vinacafé 3-in-1', 'type': 'Hot Instant Coffee Packet', 'size': '20g' };
    const putResponse = await mockRequest.put(`/api/v2/drinks/${drinkTwoId}`).send(putObject);
    expect(putResponse.body).toStrictEqual(
      {
        '_id': drinkTwoId, 'name': 'Vinacafé 3-in-1', 'type': 'Hot Instant Coffee Packet', 'size': '20g', '__v': 0,
      },
    );
  });
  // Destroy a record using DELETE
  it('correctly deletes a drink', async () => {
    const deleteResponse1 = await mockRequest.delete(`/api/v2/drinks/${drinkOneId}`);
    expect(deleteResponse1.status).toBe(200);
    const deleteResponse2 = await mockRequest.delete(`/api/v2/drinks/${drinkTwoId}`);
    expect(deleteResponse2.status).toBe(200);
  });
});
