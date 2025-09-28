// tests/unit/auth.service.test.ts
import { AuthService, CreateUserData } from '../../src/services/auth';
import { db } from '../../src/database';
import { users } from '../../src/database/schema';
import bcrypt from 'bcrypt';
import { AppError } from '../../src/middleware/errorHandler';

// Mock the database module
jest.mock('../../src/database', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = AuthService.getInstance();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserData = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      };
      const hashedPassword = 'hashedpassword';
      const createdUser = { id: 1, ...userData, createdAt: new Date(), updatedAt: new Date() };

      (db.where as jest.Mock).mockResolvedValueOnce([]); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (db.returning as jest.Mock).mockResolvedValue([createdUser]);

      const result = await authService.createUser(userData);

      expect(db.insert).toHaveBeenCalledWith(users);
      expect(db.values).toHaveBeenCalledWith(expect.objectContaining({ email: userData.email, password: hashedPassword }));
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if user already exists', async () => {
      const userData: CreateUserData = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
      };
      
      (db.where as jest.Mock).mockResolvedValue([{ id: 1, ...userData }]);

      await expect(authService.createUser(userData)).rejects.toThrow(
        new AppError('User with this email already exists', 409)
      );
    });
  });
});
