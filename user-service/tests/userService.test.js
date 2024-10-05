const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('User Service API', () => {
  let token; // To store the JWT token after login
  let userId; // To store the user ID after registration
  let adminToken; // To store the admin JWT token

  const registerUser = async (email, username, password) => {
    return await request(app)
      .post('/api/user/register')
      .send({ email, username, password });
  };

  const loginUser = async (email, password) => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    return response.body;
  };

  beforeAll(async () => {
    await registerUser('user@example.com', 'username', 'password123');
    const { token: jwtToken, user_id } = await loginUser('user@example.com', 'password123');
    token = jwtToken; // Save the token for authenticated requests
    userId = user_id; // Save the user ID for future reference
    const adminResponse = await request(app)
     .post('/api/auth/login')
     .send({
       email: process.env.USER_EMAIL_USER,
       password: process.env.USER_EMAIL_PASS,
     });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await request(app)
      .delete('/api/user/profiles')
      .set('Authorization', `Bearer ${adminToken}`);
    await mongoose.connection.close();
  });

  describe('POST /api/user/register', () => {
    it('should register a new user', async () => {
      const response = await registerUser('newuser@example.com', 'newusername', 'newpassword123');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User registered successfully.');
    });

    it('should return 400 if email already exists', async () => {
      // Registering the existing user
      const response = await registerUser('user@example.com', 'anotherusername', 'password123');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email already exists.');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'updatedUsername',
          password: 'newPassword123',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully.');
    });
  });

  describe('GET /api/user/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('username', 'updatedUsername');
    });

    it('should return 404 if the profile does not exist', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/user/profile/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Health Check', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'Hello from user service.');
    });
  });

  describe('GET /api/user/profiles (Admin Only)', () => {
    it('should retrieve all users', async () => {
      const response = await request(app)
        .get('/api/user/profiles')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/user/promote (Admin Only)', () => {
    it('should change user admin status', async () => {
      const response = await request(app)
        .put('/api/user/promote')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: userId,
          isAdmin: true,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', "User's admin status updated to true.");
    });
  });

  describe('DELETE /api/user/profile/:id', () => {
    it('should delete user profile', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      const user_id = response.body._id.toString();

      const response2 = await request(app)
        .delete(`/api/user/profile/${user_id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response2.statusCode).toBe(200);
      expect(response2.body.message).toBe('User deleted successfully.');
    });
  });

  describe('DELETE /api/user/profiles (Admin Only)', () => {
    it('should delete all users', async () => {
      const response = await request(app)
        .delete('/api/user/profiles')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'All users deleted successfully.');
    });
  });
});
