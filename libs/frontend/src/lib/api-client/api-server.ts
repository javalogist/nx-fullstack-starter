import { fetchRequest, getToken } from "./api-client.config";

// 👑 Public API
export const apiServer = {
    get: <T>(endpoint: string, rewrite = false) => fetchRequest<T>('GET', endpoint, rewrite),
    post: <T>(endpoint: string, body: any, rewrite = false) => fetchRequest<T>('POST', endpoint, rewrite, body),
    put: <T>(endpoint: string, body: any, rewrite = false) => fetchRequest<T>('PUT', endpoint, rewrite, body),
    delete: <T>(endpoint: string, rewrite = false) => fetchRequest<T>('DELETE', endpoint, rewrite),
    raw: fetchRequest,
    getToken, // optionally export token accessor
  };
  