const express = require('express');
const request = require('supertest');
const healthCheck = require('./health');
const healthzCheck = require('./healthz');

describe('Health Check', () => {
  let app;

  beforeEach(() => {
    app = express();
    healthCheck(app);
    healthzCheck(app);
  });

  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

it('should return 200 OK', async () => {
  const res = await request(app).get('/healthz');
  expect(res.statusCode).toBe(200);
  });


});