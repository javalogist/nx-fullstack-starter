import { LoginType } from '@kodevy-core-2.0/shared';

export interface JwtPayload {
  sub: string;  // User ID
  email: string;
  roles: string[];
  loginType: LoginType;
  iat?: number;  // Issued at
  exp?: number;  // Expiration time
} 