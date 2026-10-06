import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import app from '../server.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

let adminToken = '';
let staffToken = '';
let createdProductId = '';

const testAdmin = {
  name: 'Test Admin User',
  email: `testadmin_${Date.now()}@example.com`,
  password: 'Password123!',
  role: 'ADMIN',
};

const testStaff = {
  name: 'Test Staff User',
  email: `teststaff_${Date.now()}@example.com`,
  password: 'Password123!',
  role: 'STAFF',
};

const sampleProduct = {
  name: 'Unit Test Keyboard',
  sku: `TEST-KB-${Date.now()}`,
  description: 'Precision mechanical typing tool for testing.',
  category: 'Electronics',
  price: 149.99,
  stockQuantity: 15,
};

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  // Clean up only test resources
  try {
    await User.deleteMany({ email: { $in: [testAdmin.email, testStaff.email] } });
    if (createdProductId) {
      await Product.findByIdAndDelete(createdProductId);
    }
    await Product.deleteMany({ sku: { $regex: '^TEST-' } });
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
});

describe('1. Authentication API (/api/auth)', () => {
  it('POST /api/auth/register creates a new user (STAFF by default)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testStaff);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testStaff.email.toLowerCase());
    expect(res.body.data.user.role).toBe('STAFF');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined(); // Password hash not exposed
    staffToken = res.body.data.token;
  });

  it('POST /api/auth/register rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testStaff);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register creates an ADMIN user when specified', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testAdmin);

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.token;
  });

  it('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/auth/login rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: 'WrongPassword999' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me returns current user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testAdmin.email.toLowerCase());
  });

  it('GET /api/auth/me rejects request without token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('2. Authorization & Product Management API', () => {
  it('GET /api/products rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  it('GET /api/products returns products for authenticated staff', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/products allows creating product with valid data', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    expect(res.status).toBe(201);
    expect(res.body.data.sku).toBe(sampleProduct.sku);
    expect(res.body.data.stockStatus).toBe('In Stock');
    createdProductId = res.body.data._id;
  });

  it('POST /api/products rejects duplicate SKU with 409', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    expect(res.status).toBe(409);
  });

  it('GET /api/products/:id retrieves product by ID', async () => {
    const res = await request(app)
      .get(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(createdProductId);
  });

  it('PUT /api/products/:id updates product details', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ price: 179.99, stockQuantity: 8 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(179.99);
    expect(res.body.data.stockStatus).toBe('Low Stock'); // 1-10 is Low Stock
  });

  it('DELETE /api/products/:id BLOCKS STAFF with 403 Forbidden', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${staffToken}`); // STAFF attempted delete

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/products/:id ALLOWS ADMIN to delete product', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`); // ADMIN delete

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/products/stats returns aggregated stats for dashboard', async () => {
    const res = await request(app)
      .get('/api/products/stats')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalProducts');
    expect(res.body.data).toHaveProperty('inStock');
    expect(res.body.data).toHaveProperty('lowStock');
    expect(res.body.data).toHaveProperty('outOfStock');
  });
});
