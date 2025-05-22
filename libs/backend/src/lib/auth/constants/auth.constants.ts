export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE';
export const USER_SERVICE_TOKEN = 'USER_SERVICE';

export const JWT_STRATEGY = 'jwt';
export const LOCAL_STRATEGY = 'local';
export const GOOGLE_STRATEGY = 'google';

export const DEFAULT_JWT_EXPIRES_IN = '1d';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';


export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]; 

export const enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  APPLE = 'apple',
}
