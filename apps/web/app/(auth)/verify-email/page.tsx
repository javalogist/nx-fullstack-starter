// app/verify/page.tsx

import { apiClient } from "apps/web/api-client/api-client";
import { redirect } from "next/navigation";
import { ApiResponse } from "@kodevy-core-2.0/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kodevy-core-2.0/frontend/client";
import { Alert, AlertDescription, AlertTitle } from "@kodevy-core-2.0/frontend/client";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Skeleton } from "@kodevy-core-2.0/frontend/client";
import { Suspense } from "react";
import { delay } from "@kodevy-core-2.0/frontend/shared";

interface VerifyPageProps {
    searchParams: Promise<{ token?: string }>;
  }

async function verifyEmail(token: string) {
  await delay(5000);
  try {
    const response = await apiClient.get<ApiResponse<null>>(`auth/verify-email?token=${token}`);
    if(response.success){
      return response.data!;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const VerificationLoading = () => (
  <div className="container flex items-center justify-center min-h-[80vh]">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
        <CardDescription className="text-center">
          Verifying your email address...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Please wait while we verify your email</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const VerificationContent = async ({ token }: { token: string }) => {
  const authCode = await verifyEmail(token);

  if (!authCode) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Verify your email address to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                The verification process failed. Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  redirect(`/success?code=${authCode}`);
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Verify your email address to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Invalid verification token. Please check your email and try again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerificationContent token={token} />
    </Suspense>
  );
}
