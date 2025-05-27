'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TokenManager } from '@kodevy-core-2.0/frontend/shared';

interface AuthRedirectHandlerProps {
  type: 'google' | 'email' | 'direct';
}

export const AuthRedirectHandler = ({ type }: AuthRedirectHandlerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleRedirect() {
      try{
      const token = searchParams.get('token');
      if (!token){ router.replace('/login');
      return;
      }
        await TokenManager.set(token);
        router.replace('/'); 
        return;
      }catch(e){
        router.replace('/login?error=token_invalid');
      }
    }

    handleRedirect();
  }, [type, searchParams]);

  return <p>Signing you in...</p>;
}

