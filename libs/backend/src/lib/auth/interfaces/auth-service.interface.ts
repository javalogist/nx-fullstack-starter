import { IBaseUser } from '@kodevy-core-2.0/shared';
import { OAuthProvider } from '../constants/auth.constants';

export interface IAuthService<T extends IBaseUser = IBaseUser> {
  // Core authentication methods
  findById(id: string): Promise<T>;
  validateUser(email: string, password: string): Promise<T>;
  
  // JWT related methods
  generateToken(user: T): Promise<string>;

  // OAuth related methods
  findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<T>;
  
} 