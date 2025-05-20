export type AccessTokenPayload = {
    sub: string;        // User ID
    email?: string;     // User email
    iat: number;        // Issued at
    exp: number;        // Expires at
    aud?: string;       // Audience (optional)
  } 