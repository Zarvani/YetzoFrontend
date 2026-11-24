import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_URL = process.env.BACKEND_API_URL || process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the OTP verification to Django
    const response = await fetch(`${DJANGO_API_URL}/v1/auth/otp/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data?.access) {
      // Set the HttpOnly cookie
      const cookieStore = await cookies();
      
      cookieStore.set({
        name: 'yetzo_access_token',
        value: data.data.access,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      if (data.data.refresh) {
        cookieStore.set({
          name: 'yetzo_refresh_token',
          value: data.data.refresh,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      // Return success without exposing the token to the client JS
      return NextResponse.json({ 
        success: true, 
        user: data.data.user 
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
