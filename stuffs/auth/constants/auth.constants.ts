export const AUTH_SERVICE = 'AUTH_SERVICE';
export const GOOGLE_AUTH_SERVICE = 'GOOGLE_AUTH_SERVICE';

export const JWT_STRATEGY = 'jwt';
export const LOCAL_STRATEGY = 'local';
export const GOOGLE_STRATEGY = 'google';

export const DEFAULT_JWT_EXPIRES_IN = '1d';
export const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '7d';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]; 