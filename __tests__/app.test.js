const request = require('supertest');
const app = require('../app');

describe('Campus Lost and Found API', () => {
  test('GET /health should return service status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.service).toBe('Campus Lost and Found API');
  });

  test('GET /items should return a list of lost items', async () => {
    const response = await request(app).get('/items');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /items should create a new lost item', async () => {
    const response = await request(app)
      .post('/items')
      .send({
        name: 'Blue Water Bottle',
        location: 'Cafeteria',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Blue Water Bottle');
    expect(response.body.location).toBe('Cafeteria');
    expect(response.body.claimed).toBe(false);
  });

  test('PATCH /items/:id/claim should mark an item as claimed', async () => {
    const createResponse = await request(app)
      .post('/items')
      .send({
        name: 'Wireless Mouse',
        location: 'Computer Lab',
      });

    const itemId = createResponse.body.id;

    const response = await request(app).patch(`/items/${itemId}/claim`);

    expect(response.statusCode).toBe(200);
    expect(response.body.claimed).toBe(true);
  });
});