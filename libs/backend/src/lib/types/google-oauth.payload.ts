export type GoogleOAuthPayload = {
    id: string;
    displayName: string;
    name?: {
      familyName?: string;
      givenName?: string;
    };
    emails?: { value: string; verified?: boolean }[];
    photos?: { value: string }[];
    provider: 'google';
    _json?: any; // raw JSON Google sends, can be handy for extra data
  }
  