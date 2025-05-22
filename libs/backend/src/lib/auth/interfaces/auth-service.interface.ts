import { IBaseUser } from '@kodevy-core-2.0/shared';
import { OAuthProvider } from '../constants/auth.constants';

export interface IAuthService {
  // Core authentication methods
  findById(id: string): Promise<IBaseUser>;
  validateUser(email: string, password: string): Promise<IBaseUser>;
  registerUser(email:string, password:string): Promise<IBaseUser>;
  
  // JWT related methods
  generateToken(user: IBaseUser): Promise<string>;

  // OAuth related methods
  findOrCreateOAuthUser(provider: OAuthProvider, profile: Record<string, any>): Promise<IBaseUser>;
  
} 