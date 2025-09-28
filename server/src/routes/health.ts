import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database';
import { config } from '../config/environment';

const router = Router();

// Liveness probe - basic server health
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// Readiness probe - comprehensive health check
router.get('/ready', async (_req: Request, res: Response) => {
  const healthChecks = {
    server: { status: 'healthy', timestamp: new Date().toISOString() },
    database: { status: 'unknown', latency: 0, connections: {} },
  };

  let overallStatus = 200;

  try {
    // Database health check
    const dbService = DatabaseService.getInstance();
    const dbHealth = await dbService.healthCheck();
    healthChecks.database = dbHealth;

    if (dbHealth.status !== 'healthy') {
      overallStatus = 503;
    }
  } catch (error) {
    healthChecks.database.status = 'unhealthy';
    overallStatus = 503;
  }

  const response = {
    status: overallStatus === 200 ? 'ready' : 'not ready',
    checks: healthChecks,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0',
  };

  res.status(overallStatus).json(response);
});

// General health endpoint
router.get('/', async (_req: Request, res: Response) => {
  try {
    const dbService = DatabaseService.getInstance();
    const dbHealth = await dbService.healthCheck();
    
    const health = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      version: '1.0.0',
      checks: {
        database: dbHealth,
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          free: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          unit: 'MB',
        },
        cpu: {
          usage: process.cpuUsage(),
        },
      },
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRoutes };
