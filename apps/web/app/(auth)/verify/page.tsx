// app/verify/page.tsx

import { apiServer } from "@kodevy-core-2.0/frontend/server";

interface VerifyPageProps {
    searchParams: Promise<{ token?: string }>;
  }

async function verifyEmail(token: string) {
  try {
    const response = await apiServer.get(`auth/verify-email?token=${token}`);
    return response;
  } catch (e) {
    return null;
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

  return <div>Email verified successfully. You can now login to your account.</div>;
}
