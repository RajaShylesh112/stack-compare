import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private static instance: JWTService;

  private constructor() {}

  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  /**
   * Generate access and refresh token pair
   */
  public generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  /**
   * Generate access token (short-lived)
   */
  public generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'stackcompare-backend',
      audience: 'stackcompare-frontend',
    } as any);
  }

  /**
   * Generate refresh token (long-lived)
   */
  public generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(
      { userId: payload.userId, type: 'refresh' },
      config.JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'stackcompare-backend',
        audience: 'stackcompare-frontend',
      } as any
    );
  }

  /**
   * Verify and decode a token
   */
  public verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: 'stackcompare-backend',
        audience: 'stackcompare-frontend',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  public decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Extract token from Authorization header
   */
  public extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Get token expiration time
   */
  public getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return null;

      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.verifyToken(refreshToken);
      
      if (!decoded.userId || (decoded as any).type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Here you would typically fetch the user from the database
      // to get the latest user information and permissions
      const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: decoded.userId,
        email: decoded.email || '', // You'd fetch this from DB
        ...(decoded.role && { role: decoded.role }),
        ...(decoded.permissions && { permissions: decoded.permissions }),
      };

      return this.generateAccessToken(payload);
    } catch (error) {
      throw new Error('Failed to refresh token: ' + (error as Error).message);
    }
  }
}
