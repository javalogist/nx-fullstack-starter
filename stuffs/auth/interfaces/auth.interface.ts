import { JwtPayload } from '../types/jwt.payload';
import { IBaseUser } from '@kodevy-core-2.0/shared';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<IBaseUser | null>;
  generateToken(user: IBaseUser): string;
  validateToken(token: string): JwtPayload;
  refreshToken(token: string): string;
}

export interface IGoogleAuthService {
  validateGoogleToken(token: string): Promise<IBaseUser | null>;
  generateGoogleAuthUrl(): string;
  handleGoogleCallback(code: string): Promise<IBaseUser>;
} 