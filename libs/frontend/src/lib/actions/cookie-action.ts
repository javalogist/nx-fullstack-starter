'use server';
import { cookies } from 'next/headers';

export const setCookie = async (key: string, value: string, maxAge: number) => {
  const secureCookie = process.env.SECURE_COOKIE === 'true';
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: '/',
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge,
  });
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || '';
};

export const deleteCookie = async (key: string) => {
  const secureCookie = process.env.SECURE_COOKIE === 'true';
  const cookieStore = await cookies();
  cookieStore.delete({
    name: key,
    path: '/',
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge: 0,
  });
};





