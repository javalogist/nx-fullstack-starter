import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kodevy-core-2.0/frontend/client";
import { Alert, AlertDescription, AlertTitle } from "@kodevy-core-2.0/frontend/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@kodevy-core-2.0/frontend/client";
import { Suspense } from "react";
import { delay } from '@kodevy-core-2.0/frontend/shared';
import { ApiResponse } from '@kodevy-core-2.0/shared';
import { apiClient } from 'apps/web/api-client/api-client';
import { AuthSuccessHandler } from '../../../components/auth/auth-success.handler';

interface AuthSuccessPageProps {
  searchParams: Promise<{ code?: string }>;
}

const LoadingState = () => (
  <div className="container flex items-center justify-center min-h-[80vh]">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Signing In</CardTitle>
        <CardDescription className="text-center">
          Please wait while we complete your sign in...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Setting up your account</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorState = () => (
  <div className="container flex items-center justify-center min-h-[80vh]">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign In Failed</CardTitle>
        <CardDescription className="text-center">
          We couldn't complete your sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            There was a problem completing your sign in. Please try again or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </div>
);

async function handleAuthCode(code: string) {
  await delay(1000);
  try {
    const res = await apiClient.get<ApiResponse<string>>('auth/exchange-auth-code?code=' + code);
    if (res.success) {
      return res.data;
    }
    return null;
  } catch (e) {
    console.error('Auth code exchange failed:', e);
    return null;
  }
}

export default async function AuthSuccessPage({searchParams}: AuthSuccessPageProps) {
  const params = await searchParams;
  const code = params.code;

  if (!code) {
    redirect('/login');
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <AuthContent code={code} />
    </Suspense>
  );
}

async function AuthContent({ code }: { code: string }) {
  const token = await handleAuthCode(code);

  if (!token) {
    return <ErrorState />;
  }

  return <AuthSuccessHandler token={token} />;
}
