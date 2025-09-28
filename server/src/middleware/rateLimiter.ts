import { Request, Response, NextFunction } from 'express';

// Simple rate limiting middleware (placeholder)
// TODO: Implement proper rate limiting with express-rate-limit when types are resolved

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  // Skip rate limiting for health checks
  if (req.path === '/health' || req.path.startsWith('/health/')) {
    return next();
  }

  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (userLimit.count >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP, please try again later',
      retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
    });
  }

  userLimit.count++;
  next();
};

// Stricter rate limiting for authentication endpoints
export const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;
  
  const now = Date.now();
  const userLimit = requestCounts.get(`auth:${ip}`);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(`auth:${ip}`, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (userLimit.count >= maxRequests) {
    return res.status(429).json({
      error: 'Authentication rate limit exceeded',
      message: 'Too many login attempts, please try again later',
      retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
    });
  }

  userLimit.count++;
  next();
};
