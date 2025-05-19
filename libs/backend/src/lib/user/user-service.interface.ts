  import { IBaseUser } from '@kodevy-core-2.0/shared';

export interface IUserService<TUser = IBaseUser> {
  // Validate user credentials (email + password)
  validateUser(email: string, password: string): Promise<TUser | null>;

  // Find user by unique ID (used by JWT strategy)
  findById(id: string): Promise<TUser | null>;

  // For OAuth: Find or create a user given provider + identifier + profile info
  findOrCreateOAuthUser(provider: string, email: string, profile: any): Promise<TUser>;
}
