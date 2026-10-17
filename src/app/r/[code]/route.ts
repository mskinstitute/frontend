import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/config/api';

const API_BASE = BACKEND_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = (code || '').trim();

  // 1. Asynchronously log click event to backend API
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer') || '';

  try {
    fetch(`${API_BASE}/api/affiliates/track-click/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref_code: cleanCode,
        ip_address: ip,
        user_agent: userAgent,
        referer: referer,
      }),
    }).catch(() => {});
  } catch (err) {
    // Non-blocking tracking failure
  }

  // 2. Redirect to registration with ref query param
  const registerUrl = new URL('/register', req.url);
  if (cleanCode) {
    registerUrl.searchParams.set('ref', cleanCode);
  }

  const response = NextResponse.redirect(registerUrl);

  // 3. Set first-touch attribution cookie (60 days, httpOnly)
  if (cleanCode) {
    response.cookies.set('msk_ref_code', cleanCode, {
      maxAge: 60 * 24 * 60 * 60, // 60 days
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return response;
}
