import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "../actions/cookie-action";
import { LOCAL_STORAGE_KEY } from "./token.constant";
import { ACCESS_TOKEN_KEY } from "./token.constant";


export const getToken = async (): Promise<string | null> => {
  const isServer = typeof window === 'undefined';
  if (!isServer) {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } else {
    return await getCookie(ACCESS_TOKEN_KEY);
  }
};

export const storeToken = async (token: string | null | undefined) => {
  if (!token) return;
  localStorage.setItem(LOCAL_STORAGE_KEY, token);
  const maxAge = await getTokenMaxAge(token);
  await setCookie(ACCESS_TOKEN_KEY, token, maxAge);
};

export const getTokenMaxAge = async (token: string) => {
  const decoded = jwtDecode<{ exp: number }>(token);
  const expiresAt = decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds

  if (!expiresAt || expiresAt <= Date.now())
    throw new Error('Invalid or expired token');

  const remainingDuration = expiresAt - Date.now(); // ✅ Store remaining duration instead
  const maxAge = Math.floor(remainingDuration / 1000); // Convert to seconds
  return maxAge;
};


export const deleteToken = async () => {
  // Remove token from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access-token');
  }

  // Call the internal logout route 
  await fetch('api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
