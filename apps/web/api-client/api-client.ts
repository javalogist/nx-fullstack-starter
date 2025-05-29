import { createApiClient, ApiClient } from "@nx-fullstack-starter/frontend/shared";

export const apiClient:ApiClient = createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    apiVersion: process.env.NEXT_PUBLIC_API_VERSION || '',
    rewritePrefix: process.env.NEXT_PUBLIC_API_REWRITE_PREFIX || '',
    loginPageRoute: '/login',
    globalPrefix: process.env.NEXT_PUBLIC_API_GLOBAL_PREFIX || '',
});