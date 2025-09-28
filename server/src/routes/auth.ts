import { Router, Request, Response } from 'express';
import { JWTService } from '../services/jwt';
import { AuthService } from '../services/auth';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = Router();
const jwtService = JWTService.getInstance();
const authService = AuthService.getInstance();

// Test endpoint to verify JWT token
router.get('/verify', authenticate, catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Token is valid',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
}));

// Refresh token endpoint
router.post('/refresh', catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const newAccessToken = await jwtService.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
}));

// User registration endpoint
router.post('/register', catchAsync(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  // Validate input
  if (!email || !password || !username) {
    throw new AppError('Email, password, and username are required', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new AppError('Please provide a valid email address', 400);
  }

  // Validate password strength
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }

  try {
    // Create user
    const user = await authService.createUser({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      username: username.trim(),
    });

    // Generate JWT tokens
    const tokenPair = jwtService.generateTokenPair({
      userId: user.id.toString(),
      email: user.email,
      username: user.username,
      permissions: ['read', 'write'], // Default permissions
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    // Handle duplicate email/username error from the database
    if ((error as any).code === '23505') {
      throw new AppError('User with this email or username already exists', 409);
    }
    throw new AppError('Registration failed', 500);
  }
}));

// Login endpoint - Database-backed authentication
router.post('/login', catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input types and presence
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    throw new AppError('Email and password are required and must be strings', 400);
  }

  // Trim whitespace
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    throw new AppError('Email and password cannot be empty', 400);
  }

  // Authenticate user against database
  const user = await authService.authenticateUser({ email: trimmedEmail, password: trimmedPassword });

  // Generate JWT tokens
  const tokenPair = jwtService.generateTokenPair({
    userId: user.id.toString(),
    email: user.email,
    username: user.username,
    permissions: ['read', 'write'], // Default permissions
  });

  res.status(200).json({
    message: 'Login successful',
    user,
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    timestamp: new Date().toISOString(),
  });
}));

// Logout endpoint (placeholder)
router.post('/logout', authenticate, catchAsync(async (_req: Request, res: Response) => {
  // TODO: Implement token blacklisting if needed
  res.status(200).json({
    message: 'Logged out successfully',
    timestamp: new Date().toISOString(),
  });
}));

// User profile endpoint
router.get('/me', authenticate, catchAsync(async (req: Request, res: Response) => {
  // TODO: Fetch additional user data from database
  res.status(200).json({
    message: 'Profile retrieved successfully',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
}));

export { router as authRoutes };
