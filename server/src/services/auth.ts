import bcrypt from 'bcrypt';
import { db } from '../database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';

// This represents the user data returned to the client (password excluded)
export interface UserPublic {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  username: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with email and password
   */
  public async authenticateUser(credentials: LoginCredentials): Promise<UserPublic> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    try {
      const result = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));

      if (result.length === 0) {
        throw new AppError('Invalid credentials or user not found', 401);
      }

      const user = result[0];

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        throw new AppError('Invalid credentials or user not found', 401);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Authentication error:', error);
      throw new AppError('Authentication failed due to a server error', 500);
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: number): Promise<UserPublic | null> {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }).from(users).where(eq(users.id, id));

      if (result.length === 0) {
        return null;
      }
      
      return result[0];

    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new AppError('Could not retrieve user', 500);
    }
  }

  /**
   * Create a new user
   */
  public async createUser(userData: CreateUserData): Promise<UserPublic> {
    const { email, password, username } = userData;

    if (!email || !password || !username) {
      throw new AppError('Email, password, and username are required', 400);
    }

    try {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
      if (existingUser.length > 0) {
        throw new AppError('User with this email already exists', 409);
      }
      
      const existingUsername = await db.select().from(users).where(eq(users.username, username));
      if (existingUsername.length > 0) {
        throw new AppError('User with this username already exists', 409);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        username,
      };

      const result = await db.insert(users).values(newUser).returning({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

      if (result.length === 0) {
        throw new AppError('Failed to create user', 500);
      }

      return result[0];

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('User creation error:', error);
      throw new AppError('User creation failed due to a server error', 500);
    }
  }
}
