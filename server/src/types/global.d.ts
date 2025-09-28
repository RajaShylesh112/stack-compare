// Type definitions for custom modules and extensions
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime?: Date;
}

declare global {
  namespace Express {
    interface Request {
      rateLimit: RateLimitInfo;
    }
  }
}
