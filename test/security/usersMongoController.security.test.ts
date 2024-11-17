import request from 'supertest';
import app  from '../../src/index';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { UsersMongoService } from '../../src/services/usersMongo.service';
import { emit } from 'process';


jest.mock('../../src/services/usersMongo.service'); 

describe('UserMongoController Security Tests', () => {
  // Mock pour empêcher les vrais appels à la base de données
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /users/login', () => {
    it('should reject SQL injection attempts in login', async () => {
      const maliciousSQLPayload = { email: "' OR 1=1 --", password: "password" };
      const response = await request(app)
        .post('/users/login')
        .send(maliciousSQLPayload);

      expect(response.status).toBe(401); 
      expect(response.body.message).toBe('Connexion echouee');
    });

    it('should reject XSS injection attempts in login', async () => {
      const maliciousScriptedPayload = { email: "<script>alert('XSS')</script>", password: "password" };
      const response = await request(app)
        .post('/users/login')
        .send(maliciousScriptedPayload);

      expect(response.status).toBe(401); 
      expect(response.body.message).toBe('Connexion echouee');
    });

    it('should reject command injection attempts in login', async () => {
      const maliciousCommandPayload = { email: "; rm -rf /", password: "password" };
      const response = await request(app)
        .post('/users/login')
        .send(maliciousCommandPayload);

      expect(response.status).toBe(401); 
      expect(response.body.message).toBe('Connexion echouee');
    });
  });

  describe('POST /users', () => {
    it('should reject SQL injection attempts in user creation', async () => {
      const maliciousSQLPayload = {
        email: "' OR 1=1 --",
        password: "password123",
        name: "Test User",
      };

      const response = await request(app)
        .post('/users')
        .send(maliciousSQLPayload);

      expect(response.status).toBe(400); 
      expect(response.body.message).toBe('Invalid input');
    });

    it('should reject XSS injection attempts in user creation', async () => {
      const maliciousScriptedPayload = {
        email: "test@example.com",
        password: "password123",
        name: "<script>alert('XSS')</script>",
      };

      const response = await request(app)
        .post('/users')
        .send(maliciousScriptedPayload);

      expect(response.status).toBe(400); 
      expect(response.body.message).toBe('Invalid input');
    });

    it('should reject command injection attempts in user creation', async () => {
      const maliciousPayload = {
        email: "test@example.com",
        password: "password123",
        name: "; rm -rf /",
      };

      const response = await request(app)
        .post('/users')
        .send(maliciousPayload);

      expect(response.status).toBe(404); 
      expect(response.body.message).toBe(undefined);
    });
  });
});