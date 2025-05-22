import { IBaseUser } from '@kodevy-core-2.0/shared';

export interface IUserService<TUser = IBaseUser> {
  // Core user operations
  findAll(): Promise<TUser[]>;
  findById(id: string): Promise<TUser | null>;
  findByEmail(email: string): Promise<TUser | null>;
  create(userData: Partial<TUser>): Promise<TUser>;
  update(id: string, userData: Partial<TUser>): Promise<TUser>;
  delete(id: string): Promise<void>;

  // Authentication methods
  validateUser(email: string, password: string): Promise<TUser | null>;
  validatePassword(user: TUser, password: string): Promise<boolean>;

  // OAuth methods
  findOrCreateOAuthUser(provider: string, email: string, profile: any): Promise<TUser>;
}
