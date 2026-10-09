import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('yetzo_access_token');
  cookieStore.delete('yetzo_refresh_token');
  return NextResponse.json({ success: true });
}
