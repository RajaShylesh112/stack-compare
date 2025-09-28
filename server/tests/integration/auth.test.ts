// tests/integration/auth.test.ts
import request from 'supertest';
import { app } from '../../src/app'; // Assuming your Express app is exported from app.ts
import { db } from '../../src/database';
import { users } from '../../src/database/schema';
import bcrypt from 'bcrypt';

describe('Auth API Endpoints', () => {
  // Clean up the database before and after tests
  beforeAll(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 409 if email already exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'anotheruser',
        });

      expect(response.status).toBe(409);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          username: 'testuser2',
        });
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'password123',
          username: 'testuser3',
        });
      expect(response.status).toBe(400);
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test4@example.com',
          password: '123',
          username: 'testuser4',
        });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    beforeAll(async () => {
      // Create a user to test login
      const hashedPassword = await bcrypt.hash('loginpassword', 10);
      await db.insert(users).values({
        email: 'login@example.com',
        password: hashedPassword,
        username: 'loginuser',
      });
    });

    it('should login an existing user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'loginpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe('login@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nosuchuser@example.com',
          password: 'password123',
        });
      expect(response.status).toBe(401);
    });
  });

  describe('Authenticated Routes', () => {
    let token = '';
    let refreshToken = '';

    beforeAll(async () => {
      // Register and login a user to get a token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'auth-test@example.com',
          password: 'password123',
          username: 'authtestuser',
        });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'auth-test@example.com',
          password: 'password123',
        });
      
      token = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should access /me with a valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('auth-test@example.com');
    });

    it('should not access /me without a token', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
    });

    it('should refresh the access token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBe(token);
    });
  });
});
