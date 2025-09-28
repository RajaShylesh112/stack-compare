import { Pool, PoolConfig } from 'pg';
import { config } from '../config/environment';

interface DatabaseError extends Error {
  code?: string;
  severity?: string;
  detail?: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected && this.pool) {
      return;
    }

    try {
      const poolConfig: PoolConfig = {
        host: config.DB_HOST,
        port: config.DB_PORT,
        database: config.DB_NAME,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        ssl: config.DB_SSL ? { 
          rejectUnauthorized: false
        } : false,
        // Connection pool configuration
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
        connectionTimeoutMillis: 10000, // Increased timeout for SSL connections
        // Health check query
        application_name: 'stackcompare-backend',
      };

      this.pool = new Pool(poolConfig);

      // Test the connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log('✅ Database connection established');

      // Handle pool errors
      this.pool.on('error', (err: DatabaseError) => {
        console.error('❌ Database pool error:', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        this.pool = null;
        this.isConnected = false;
        console.log('✅ Database disconnected');
      } catch (error) {
        console.error('❌ Error disconnecting from database:', error);
        throw error;
      }
    }
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      // Log slow queries (>100ms)
      if (duration > 100) {
        console.warn(`🐌 Slow query (${duration}ms): ${text}`);
      }

      return result.rows;
    } catch (error) {
      const dbError = error as DatabaseError;
      console.error('❌ Database query error:', {
        query: text,
        params,
        error: dbError.message,
        code: dbError.code,
        severity: dbError.severity,
        detail: dbError.detail,
      });
      throw error;
    }
  }

  public async getClient() {
    if (!this.pool || !this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.pool.connect();
  }

  public async transaction<T>(
    callback: (client: any) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    connections: {
      total: number;
      idle: number;
      waiting: number;
    };
  }> {
    if (!this.pool || !this.isConnected) {
      return {
        status: 'unhealthy',
        latency: 0,
        connections: { total: 0, idle: 0, waiting: 0 },
      };
    }

    try {
      const start = Date.now();
      await this.pool.query('SELECT 1');
      const latency = Date.now() - start;

      return {
        status: 'healthy',
        latency,
        connections: {
          total: this.pool.totalCount,
          idle: this.pool.idleCount,
          waiting: this.pool.waitingCount,
        },
      };
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return {
        status: 'unhealthy',
        latency: 0,
        connections: { total: 0, idle: 0, waiting: 0 },
      };
    }
  }

  public isHealthy(): boolean {
    return this.isConnected && this.pool !== null;
  }
}
