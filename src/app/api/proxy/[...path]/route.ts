import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const searchParams = req.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    const targetUrl = `${DJANGO_API_URL}/${path}/${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('yetzo_access_token')?.value;

    const headers = new Headers();
    // Copy all safe headers
    req.headers.forEach((value, key) => {
      if (!['host', 'connection', 'cookie', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const options: RequestInit = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text();
      if (body) options.body = body;
    }

    const response = await fetch(targetUrl, options);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
