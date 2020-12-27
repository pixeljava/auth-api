'use strict';

// Testing Requirements

// Assert the following for all V1 Routes
//  V1 (Unauthenticated) Routes
//     404 on a bad route
//     404 on a bad method
//     The correct status codes and returned data for each REST route
//         Create a record using POST
//         Read a list of records using GET
//         Read a record using GET
//         Update a record using PUT
//         Destroy a record using DELETE

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

xdescribe('The V1 web server API', () => {
  // Throw 404 on a bad route
  it('gives a 404 on a bad route', async () => {
    const response = await mockRequest.put('/api/v1/burritos');
    expect(response.status).toBe(404);
  });
  // Thrown 404 on a bad method
  it('gives a 404 on a bad CRUD method', async () => {
    const response = await mockRequest.patch('/api/v1/tacos');
    expect(response.status).toBe(404);
  });
});

xdescribe('The V1 taco API routes', () => {
  // Store our taco ids once created for reuse later.
  let tacoOneId;
  let tacoTwoId;

  // Create a record using POST
  it('correctly posts a new taco', async () => {
    // Send over taco number one...
    const postObject1 = { 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco' };
    const postResponse1 = await mockRequest.post('/api/v1/tacos').send(postObject1);
    tacoOneId = postResponse1.body._id;
    expect(postResponse1.body).toStrictEqual(
      { '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0 },
    );
  });
  // Read a list of records using GET
  it('returns all taco records', async () => {
    // Send over taco number two...
    const postObject2 = { 'name': 'Soft Shell (Yellow Corn)', 'type': 'Regular Taco' };
    const postResponse2 = await mockRequest.post('/api/v1/tacos').send(postObject2);
    tacoTwoId = postResponse2.body._id;
    // Get both our stored tacos...
    const getAllResponse = await mockRequest.get('/api/v1/tacos');
    expect(getAllResponse.body).toStrictEqual(
      [
        { '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0 },
        { '_id': tacoTwoId, 'name': 'Soft Shell (Yellow Corn)', 'type': 'Regular Taco', '__v': 0 },
      ],
    );
  });
  // Read a record using GET
  it('returns a specific taco by id', async () => {
    const response = await mockRequest.get(`/api/v1/tacos/${tacoOneId}`);
    expect(response.body).toStrictEqual(
      { 
        '_id': tacoOneId, 'name': 'Hard Shell (Supreme)', 'type': 'Regular Taco', '__v': 0,
      },
    );
  });
  // Update a record using PUT
  it('correctly updates a new taco', async () => {
    const putObject = { 'name': 'Soft Shell (White Corn)', 'type': 'Regular Soft Taco' };
    const putResponse = await mockRequest.put(`/api/v1/tacos/${tacoTwoId}`).send(putObject);
    expect(putResponse.body).toStrictEqual(
      { '_id': tacoTwoId, 'name': 'Soft Shell (White Corn)', 'type': 'Regular Soft Taco', '__v': 0 },
    );
  });
  // Destroy a record using DELETE
  it('correctly deletes a taco', async () => {
    const deleteResponse1 = await mockRequest.delete(`/api/v1/tacos/${tacoOneId}`);
    expect(deleteResponse1.status).toBe(200);
    const deleteResponse2 = await mockRequest.delete(`/api/v1/tacos/${tacoTwoId}`);
    expect(deleteResponse2.status).toBe(200);
  });
});

xdescribe('The V1 drink API routes', () => {
  // Store our drink ids once created for reuse later.
  let drinkOneId;
  let drinkTwoId;

  // Create a record using POST
  it('correctly posts a new drink', async () => {
    // Send over drink number one...
    const postObject1 = { 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml' };
    const postResponse1 = await mockRequest.post('/api/v1/drinks').send(postObject1);
    drinkOneId = postResponse1.body._id;
    expect(postResponse1.body).toStrictEqual(
      { '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0 },
    );
  });
  // Read a list of records using GET
  it('returns all drink records', async () => {
    // Send over drink number two...
    const postObject2 = { 'name': 'Cafe Bien Hoa Tan', 'type': 'Hot Instant Coffee', 'size': '150ml' };
    const postResponse2 = await mockRequest.post('/api/v1/drinks').send(postObject2);
    drinkTwoId = postResponse2.body._id;
    // Get both our stored drinks...
    const getAllResponse = await mockRequest.get('/api/v1/drinks');
    expect(getAllResponse.body).toStrictEqual(
      [
        { '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0 },
        { '_id': drinkTwoId, 'name': 'Cafe Bien Hoa Tan', 'type': 'Hot Instant Coffee', 'size': '150ml', '__v': 0 },
      ],
    );
  });
  // Read a record using GET
  it('returns a specific drink by id', async () => {
    const response = await mockRequest.get(`/api/v1/drinks/${drinkOneId}`);
    expect(response.body).toStrictEqual(
      { 
        '_id': drinkOneId, 'name': 'Bawls Guarana', 'type': 'Energy Drink', 'size': '473ml', '__v': 0,
      },
    );
  });
  // Update a record using PUT
  it('correctly updates a new drink', async () => {
    const putObject = { 'name': 'Vinacafé 3-in-1', 'type': 'Hot Instant Coffee Packet', 'size': '20g' };
    const putResponse = await mockRequest.put(`/api/v1/drinks/${drinkTwoId}`).send(putObject);
    expect(putResponse.body).toStrictEqual(
      {
        '_id': drinkTwoId, 'name': 'Vinacafé 3-in-1', 'type': 'Hot Instant Coffee Packet', 'size': '20g', '__v': 0,
      },
    );
  });
  // Destroy a record using DELETE
  it('correctly deletes a drink', async () => {
    const deleteResponse1 = await mockRequest.delete(`/api/v1/drinks/${drinkOneId}`);
    expect(deleteResponse1.status).toBe(200);
    const deleteResponse2 = await mockRequest.delete(`/api/v1/drinks/${drinkTwoId}`);
    expect(deleteResponse2.status).toBe(200);
  });
});
