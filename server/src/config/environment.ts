import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  
  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('stackcompare'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z.coerce.boolean().default(false),
  
  // JWT configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // CORS configuration
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

type EnvConfig = z.infer<typeof envSchema>;

class Config {
  private static instance: Config;
  public readonly NODE_ENV: string;
  public readonly PORT: number;
  public readonly DB_HOST: string;
  public readonly DB_PORT: number;
  public readonly DB_NAME: string;
  public readonly DB_USER: string;
  public readonly DB_PASSWORD: string;
  public readonly DB_SSL: boolean;
  public readonly JWT_SECRET: string;
  public readonly JWT_EXPIRES_IN: string;
  public readonly JWT_REFRESH_EXPIRES_IN: string;
  public readonly CORS_ORIGINS: string[];
  public readonly RATE_LIMIT_WINDOW_MS: number;
  public readonly RATE_LIMIT_MAX_REQUESTS: number;

  private constructor() {
    const env = this.parseEnvironment();
    
    this.NODE_ENV = env.NODE_ENV;
    this.PORT = env.PORT;
    this.DB_HOST = env.DB_HOST;
    this.DB_PORT = env.DB_PORT;
    this.DB_NAME = env.DB_NAME;
    this.DB_USER = env.DB_USER;
    this.DB_PASSWORD = env.DB_PASSWORD;
    this.DB_SSL = env.DB_SSL;
    this.JWT_SECRET = env.JWT_SECRET;
    this.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
    this.JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;
    this.CORS_ORIGINS = env.CORS_ORIGINS.split(',').map(origin => origin.trim());
    this.RATE_LIMIT_WINDOW_MS = env.RATE_LIMIT_WINDOW_MS;
    this.RATE_LIMIT_MAX_REQUESTS = env.RATE_LIMIT_MAX_REQUESTS;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private parseEnvironment(): EnvConfig {
    try {
      return envSchema.parse(process.env);
    } catch (error) {
      console.error('❌ Environment validation failed:');
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
      }
      throw new Error('Invalid environment configuration');
    }
  }

  public validate(): boolean {
    try {
      envSchema.parse(process.env);
      return true;
    } catch {
      return false;
    }
  }

  public getDatabaseUrl(): string {
    const protocol = this.DB_SSL ? 'postgresql' : 'postgres';
    return `${protocol}://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}${this.DB_SSL ? '?ssl=true' : ''}`;
  }

  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  public isTest(): boolean {
    return this.NODE_ENV === 'test';
  }
}

export const config = Config.getInstance();
