// libs/frontend/shared/src/app/api/auth/logout/route.ts
import { ACCESS_TOKEN_KEY } from '@kodevy-core-2.0/frontend/shared';
import { deleteCookie } from 'libs/frontend/src/lib/actions/cookie-action';
import { NextResponse } from 'next/server';


export async function POST() {
  await deleteCookie(ACCESS_TOKEN_KEY);
  return NextResponse.json({ success: true });
}
