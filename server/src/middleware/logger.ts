import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

interface RequestLog {
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  duration?: number;
  statusCode?: number;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Skip logging for health checks in production
  const shouldSkipLogging = config.isProduction() && 
    (req.path === '/health' || req.path.startsWith('/health/'));

  if (shouldSkipLogging) {
    return next();
  }

  const logData: RequestLog = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    timestamp: new Date().toISOString(),
  };

  // Log the incoming request
  if (config.isDevelopment()) {
    console.log(`📥 ${logData.method} ${logData.url} - ${logData.ip}`);
  }

  // Intercept the response to log completion
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    logData.duration = duration;
    logData.statusCode = res.statusCode;

    // Log the completed request
    const statusEmoji = getStatusEmoji(res.statusCode);
    
    if (config.isDevelopment()) {
      console.log(
        `📤 ${statusEmoji} ${logData.method} ${logData.url} - ${res.statusCode} - ${duration}ms`
      );
    }

    // Log errors and slow requests in production
    if (config.isProduction()) {
      if (res.statusCode >= 400) {
        console.error('Request error:', logData);
      } else if (duration > 1000) {
        console.warn('Slow request:', logData);
      }
    }

    return originalSend.call(this, body);
  };

  next();
};

function getStatusEmoji(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return '✅';
  if (statusCode >= 300 && statusCode < 400) return '↗️';
  if (statusCode >= 400 && statusCode < 500) return '⚠️';
  if (statusCode >= 500) return '❌';
  return '❓';
}
