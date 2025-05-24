'use server';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export const setTokenInCookies = async (token: string) => {
  const decoded = jwtDecode<{ exp: number }>(token);
  const expiresAt = decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds

  if (!expiresAt || expiresAt <= Date.now())
    throw new Error('Invalid or expired token');

  const remainingDuration = expiresAt - Date.now(); // ✅ Store remaining duration instead
  const maxAge = Math.floor(remainingDuration / 1000); // Convert to seconds
  const secureCookie = process.env.SECURE_COOKIE === 'true';
  const cookieStore = await cookies();

  // Store the access token
  cookieStore.set('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: secureCookie, // should be true in production
    sameSite: 'strict',
    maxAge,
  });

  // Store remaining session duration (instead of absolute timestamp)
  cookieStore.set('session_duration', remainingDuration.toString(), {
    path: '/',
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge,
  });
};

export const getTokenFromCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value || '';
};

export const deleteAllCookies = async () => {
  const secureCookie = process.env.SECURE_COOKIE === 'true';
  const cookieStore = await cookies();

  // Store the access token
  cookieStore.set('access_token', '', {
    path: '/',
    httpOnly: true,
    secure: secureCookie, // should be true in production
    sameSite: 'strict',
    maxAge: Date.now(),
  });

  // Store remaining session duration (instead of absolute timestamp)
  cookieStore.set('session_duration', '', {
    path: '/',
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge: Date.now(),
  });
};


