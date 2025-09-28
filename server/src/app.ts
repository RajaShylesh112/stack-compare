import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/environment';
import { authRoutes } from './routes/auth';
import { healthRoutes } from './routes/health';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/logger';

class Server {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.PORT || 3001;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: config.CORS_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Request processing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    this.app.use(rateLimiter);

    // Request logging
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check routes (no auth required)
    this.app.use('/health', healthRoutes);
    
    // API routes
    this.app.use('/api/auth', authRoutes);

    // Root endpoint
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        message: 'StackCompare Backend API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): any {
    const server = this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${this.port} is already in use`);
        console.error('💡 To fix this, you can:');
        console.error('   1. Stop the existing process using the port');
        console.error('   2. Use a different port by setting PORT environment variable');
        console.error(`   3. Kill the process: netstat -ano | findstr :${this.port}, then taskkill /PID <PID> /F`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    return server;
  }

  public getApp(): Application {
    return this.app;
  }
}

export default Server;
