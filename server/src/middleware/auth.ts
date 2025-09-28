import { Request, Response, NextFunction } from 'express';
import { JWTService, JWTPayload } from '../services/jwt';
import { AppError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = JWTService.getInstance();
  }

  /**
   * Middleware to verify JWT token and attach user to request
   */
  public authenticate = (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = this.jwtService.extractTokenFromHeader(req.headers.authorization);

      if (!token) {
        throw new AppError('Access token is required', 401);
      }

      const decoded = this.jwtService.verifyToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Invalid or expired token', 401));
      }
    }
  };

  /**
   * Middleware to check if user has required role
   */
  public requireRole = (requiredRole: string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!req.user.role || req.user.role !== requiredRole) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    };
  };

  /**
   * Middleware to check if user has any of the required permissions
   */
  public requirePermissions = (requiredPermissions: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!req.user.permissions || req.user.permissions.length === 0) {
        return next(new AppError('No permissions assigned', 403));
      }

      const hasPermission = requiredPermissions.some(permission =>
        req.user!.permissions!.includes(permission)
      );

      if (!hasPermission) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    };
  };

  /**
   * Optional authentication - doesn't throw error if no token
   */
  public optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = this.jwtService.extractTokenFromHeader(req.headers.authorization);

      if (token) {
        const decoded = this.jwtService.verifyToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error) {
      // Silent fail for optional authentication
      next();
    }
  };
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

export const authenticate = authMiddleware.authenticate;
export const requireRole = authMiddleware.requireRole;
export const requirePermissions = authMiddleware.requirePermissions;
export const optionalAuthenticate = authMiddleware.optionalAuthenticate;
