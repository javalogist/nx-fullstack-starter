// api-client.factory.ts

import { ApiClientConfig } from "./core-api.client";

import { createCoreFetcher } from "./core-api.client";


export interface ApiClient {
  get: <T>(endpoint: string, rewrite?: boolean) => Promise<T>;
  post: <T>(endpoint: string, body: any, rewrite?: boolean) => Promise<T>;
  put: <T>(endpoint: string, body: any, rewrite?: boolean) => Promise<T>;
  delete: <T>(endpoint: string, rewrite?: boolean) => Promise<T>;
  raw: <T>(method: string, endpoint: string, rewrite: boolean, body?: any) => Promise<T>;
}

export const createApiClient = (config: ApiClientConfig): ApiClient => {
  const fetchRequest = createCoreFetcher(config);

  return {
    get: <T>(endpoint:string, rewrite = false) => fetchRequest<T>('GET', endpoint, rewrite),
    post: <T>(endpoint:string, body:any, rewrite = false) => fetchRequest<T>('POST', endpoint, rewrite, body),
    put: <T>(endpoint:string, body:any, rewrite = false) => fetchRequest<T>('PUT', endpoint, rewrite, body),
    delete: <T>(endpoint:string, rewrite = false) => fetchRequest<T>('DELETE', endpoint, rewrite),
    raw: fetchRequest,
  };
};
