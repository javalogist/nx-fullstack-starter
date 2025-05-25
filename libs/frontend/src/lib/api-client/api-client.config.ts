import { toast } from 'sonner';
import { getCookie, setCookie } from '../actions/cookie-action';
import { getTokenMaxAge } from '../utils/jwt.utils';
import { ApiResponse } from '@kodevy-core-2.0/shared';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const GLOBAL_PREFIX = process.env.NEXT_PUBLIC_GLOBAL_PREFIX || 'api';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '';
const REWRITE_PREFIX = process.env.NEXT_PUBLIC_REWRITE_PREFIX || '';

const ACCESS_TOKEN_KEY = 'accessToken';
const LOCAL_STORAGE_KEY = 'accessToken';

const isServer = typeof window === 'undefined';


export const getToken = async (): Promise<string | null> => {
  if (!isServer) {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } else {
    return await getCookie(ACCESS_TOKEN_KEY);
  }
};

const storeToken = async (token: string) => {
  if (!token) return;

  if (isServer) {
    localStorage.setItem(LOCAL_STORAGE_KEY, token);
    const maxAge = await getTokenMaxAge(token);
    await setCookie(ACCESS_TOKEN_KEY, token, maxAge);
  }
};

const buildUrl = (endpoint: string, rewrite: boolean) => {
  return rewrite
    ? `/${REWRITE_PREFIX}/${endpoint}`
    : `${BASE_URL}/${GLOBAL_PREFIX}/${API_VERSION}/${endpoint}`;
};



export const fetchRequest = async <T>(
  method: string,
  endpoint: string,
  rewrite: boolean,
  body?: any
): Promise<T> => {
  const url = buildUrl(endpoint, rewrite);
  const token = await getToken();

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    // 🔐 Store accessToken if returned in Authorization header
    const authHeader = res.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      await storeToken(authHeader.slice(7));
    }

    const json = await res.json().catch(() => null);

    // 🚫 Handle auth errors
    if (res.status === 401) {
      if (!isServer) {
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
      console.error('Unauthorized access');
      throw ApiResponse.error('Unauthorized', 401, undefined, endpoint);
    }

    if (res.status === 403) {
      if (!isServer) {
        toast.error('You do not have permission to perform this action.');
      }
      console.error('Forbidden access');
      throw ApiResponse.error('Forbidden', 403, undefined, endpoint);
    }

    // ❌ Not OK response
    if (!res.ok || !json) {
      throw ApiResponse.error(
        json?.message || 'Something went wrong.',
        res.status,
        json?.errorCode,
        endpoint,
        json?.stackTrace
      );
    }

    return json.data as T;
  } catch (err: any) {
    if (err instanceof ApiResponse) throw err;
    throw ApiResponse.fromHttpError(err);
  }
};


