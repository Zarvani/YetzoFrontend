import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DJANGO_API_URL = 'https://sak.yetzo.com/api';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const subPath = resolvedParams.path.join('/');
    const searchParams = req.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    const targetUrl = `${DJANGO_API_URL}/${subPath}/${queryString}`;

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

    let response: Response;
    try {
      response = await fetch(targetUrl, options);
    } catch (fetchErr) {
      console.warn(`Upstream API unreachable for ${subPath}, checking fallback cache...`);
      response = new Response(null, { status: 503 });
    }

    // Resilient Fallback: If remote Django server throttles (429) or is unavailable (502/503/504)
    // for public catalog endpoints, serve the high-speed local verified catalog cache
    if ((response.status === 429 || response.status >= 500) && req.method === 'GET' && subPath.includes('services')) {
      try {
        const cachePath = path.join(process.cwd(), 'public', 'services_catalog.json');
        if (fs.existsSync(cachePath)) {
          const cachedData = fs.readFileSync(cachePath, 'utf-8');
          return new NextResponse(cachedData, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Yetzo-Cache': 'Resilient-Fallback-HIT',
            },
          });
        }
      } catch (cacheErr) {
        console.error('Failed to read services cache:', cacheErr);
      }
    }

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
