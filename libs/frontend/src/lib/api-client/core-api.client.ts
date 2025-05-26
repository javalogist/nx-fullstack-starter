// core-api-client.ts

import { toast } from 'sonner';
import { ApiResponse } from '@kodevy-core-2.0/shared';
import { getToken, storeToken } from './token.utils';

export interface ApiClientConfig {
  loginPageRoute:string,
  baseUrl: string;
  globalPrefix: string;
  apiVersion: string;
  rewritePrefix: string;
}

export const createCoreFetcher = (config: ApiClientConfig) => {
  const buildUrl = (endpoint: string, rewrite: boolean) => {
    return rewrite
      ? `/${config.rewritePrefix}/${endpoint}`
      : `${config.baseUrl}/${config.globalPrefix}/${config.apiVersion}/${endpoint}`;
  };

  const fetchRequest = async <T>(
    method: string,
    endpoint: string,
    rewrite: boolean,
    body?: any
  ): Promise<T> => {
    const url = buildUrl(endpoint, rewrite);
    const token = await getToken();
    const isServer = typeof window === 'undefined';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const authHeader = res.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        await storeToken(authHeader.slice(7));
      }

      const json = await res.json().catch(() => null);

      if (res.status === 401) {
        if (!isServer) {
          toast.error('Your session has expired. Please login again.');
          window.location.href = config.loginPageRoute;
        }
        throw ApiResponse.error('Unauthorized', 401, undefined, endpoint);
      }

      if (res.status === 403) {
        if (!isServer) {
          toast.error('You do not have permission to perform this action.');
        }
        throw ApiResponse.error('Forbidden', 403, undefined, endpoint);
      }

      if (!res.ok || !json) {
        throw ApiResponse.error(
          json?.message || 'Something went wrong.',
          res.status,
          json?.errorCode,
          endpoint,
          json?.stackTrace
        );
      }

      return json as T;
    } catch (err: any) {
      if (err instanceof ApiResponse) throw err;
      throw ApiResponse.fromHttpError(err);
    }
  };

  return fetchRequest;
};
