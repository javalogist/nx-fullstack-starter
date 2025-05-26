// app/verify/page.tsx

import { apiClient } from "apps/web/api-client/api-client";
import { redirect } from "next/navigation";
import { ApiResponse } from "@kodevy-core-2.0/shared";

interface VerifyPageProps {
    searchParams: Promise<{ token?: string }>;
  }

async function verifyEmail(token: string) {
  try {
    const response = await apiClient.get<ApiResponse<null>>(`auth/verify-email?token=${token}`);
    return response.success;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return <div>Invalid token</div>;
  }

  const verificationResult = await verifyEmail(token);

  if (!verificationResult) {
    return <div>Invalid token or verification failed</div>;
  }

  redirect('/?verified=1');
}
