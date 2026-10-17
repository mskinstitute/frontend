import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${backendUrl}/`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(
        {
          online: true,
          status: data?.status || 'healthy',
          timestamp: Date.now(),
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    return NextResponse.json(
      {
        online: false,
        status: 'error',
        statusCode: res.status,
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        online: false,
        status: 'offline',
        error: err?.name === 'AbortError' ? 'Timeout' : err?.message || 'Connection failed',
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}
