// app/page.tsx
import { redirect } from 'next/navigation';
import {  getCookie } from '@kodevy-core-2.0/frontend/server';

export default async function App() {
  const token = await getCookie('accessToken');

  if (token) redirect('/home');
  else redirect('/login');
}
