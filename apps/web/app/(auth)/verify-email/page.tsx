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
    if(response.success){
      return response.data!;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  console.log("Here is the params",params);
  const token = params.token;

  if (!token) {
    return <div>Invalid token</div>;
  }

  const authCode = await verifyEmail(token);

  if (!authCode) {
    return <div>Invalid token or verification failed</div>;
  }

  redirect(`/success?code=${authCode}`);
}
