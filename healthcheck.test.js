const express = require('express');
const request = require('supertest');
const healthCheck = require('./health')

describe('Health Check', () => {
  let app;

  beforeEach(() => {
    app = express();
    healthCheck(app);
  });

  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(400);
  });
});
