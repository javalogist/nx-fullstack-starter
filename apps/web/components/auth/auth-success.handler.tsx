'use client';

import { useEffect, useRef } from 'react';
import { TokenManager } from '@kodevy-core-2.0/frontend/shared';
import { useRouter } from 'next/navigation';

interface AuthSuccessHandlerProps {
  token: string;
}

export function AuthSuccessHandler({ token }: AuthSuccessHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    const setToken = async () => {
      await TokenManager.set(token);
      router.push('/');
    };
    
    setToken();
  }, [token, router]);
  return null;
} 