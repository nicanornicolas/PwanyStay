// 1. Mock external dependencies BEFORE requiring app
jest.mock('multer-storage-cloudinary', () => {
  return {
    CloudinaryStorage: jest.fn().mockImplementation(() => ({
      _handleFile: jest.fn(),
      _removeFile: jest.fn(),
    })),
  };
});

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));

const request = require('supertest');
const app = require('../src/app');
const pg = require('../src/config/postgres');
const { getClient } = require('../src/config/redis');

describe('GET /api/resource', () => {
  // Increase timeout for remote DB connections
  jest.setTimeout(10000); 

  it('responds with JSON structure', async () => {
    const res = await request(app)
      .get('/api/resource')
      .timeout({ deadline: 5000 });
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
  });
});

afterAll(async () => {
  try {
    // Ensure the pool is closed to let Jest exit
    if (pg && pg.pool) {
        await pg.pool.end();
    }
  } catch (e) {
    console.error("Cleanup Error (PG):", e.message);
  }
  
  try {
    const { client } = getClient();
    if (client && client.isOpen) { // Check if client exists and is open
      await client.quit();
    }
  } catch (e) {
    // Ignore redis cleanup errors
  }
});
