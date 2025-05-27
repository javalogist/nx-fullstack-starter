'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TokenManager } from '@kodevy-core-2.0/frontend/shared';
import { ApiResponse } from '@kodevy-core-2.0/shared';
import { apiClient } from 'apps/web/api-client/api-client';


export const AuthRedirectHandler = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasHandled = useRef(false);

    useEffect(() => {
        if (hasHandled.current) return;
        hasHandled.current = true;
        async function handleRedirect() {
            console.log("Here is the searchParams",searchParams);
            try {
                const code = searchParams.get('code');
                if (!code) router.replace('/login');
                //Token will be set in the apiClient
                const res = await apiClient.get<ApiResponse<string>>('auth/exchange-auth-code?code=' + code);
                console.log("Here is the response",res);
                if(res.success){
                    await TokenManager.set(res.data!);
                    router.replace('/');
                }else{
                    router.replace('/login');
                }
            } catch (e) {
                router.replace('/login');
            }
        }

        handleRedirect();
    }, []);

    return <p>Signing you in...</p>;
}

