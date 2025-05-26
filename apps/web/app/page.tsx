import { apiClient } from "../api-client/api-client";

interface HomePageProps {
  searchParams: Promise<{ verified?: string }>;
}

async function checkHealth() {
  try {
      const res = await apiClient.get('health');
  } catch (e) {
      throw e;
  }
}


export default async function App({searchParams}:HomePageProps) {
  const params = await searchParams;
  const verified = params.verified;
  if(verified){
    return <div>Email verified successfully. You can now login to your account.</div>;
  }
  return <div>Hello</div>;
}
