import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "../actions/cookie-action";

export const ACCESS_TOKEN_KEY = 'access-token';


const getTokenMaxAge = async (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const expiresAt = decoded.exp ? decoded.exp * 1000 : null;

    if (!expiresAt || expiresAt <= Date.now())
      throw new Error('Invalid or expired token');

    const remainingDuration = expiresAt - Date.now();
    return Math.floor(remainingDuration / 1000);
  } catch (err) {
    throw new Error('Failed to decode token');
  }
};


 const getToken = async (): Promise<string | null> => {
  const isServer = typeof window === 'undefined';
  if (!isServer) {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } else {
    return await getCookie(ACCESS_TOKEN_KEY);
  }
};

 const storeToken = async (token: string | null | undefined) => {
  if (!token) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  const maxAge = await getTokenMaxAge(token);
  await setCookie(ACCESS_TOKEN_KEY, token, maxAge);
};

const deleteToken = async () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Call the internal logout route 
  await fetch('api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};


export const TokenManager = {
  async set(token: string) {
    if (!token) return;

    if (typeof window === 'undefined') throw new Error('TokenManager can only set token on the client side');
    await storeToken(token);
  },

  async clear() {
    if (typeof window === 'undefined') throw new Error('TokenManager can only clear token on the client side');
    await deleteToken();
  },

  get: () => getToken(),

  isAuthenticated: async () => {
    try {
      const token = await getToken();
      if (!token) return false;
  
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
  
};
