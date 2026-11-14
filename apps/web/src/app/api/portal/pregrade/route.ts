import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MES_API_BASE = 'https://api.mes.gob.cu';
const TOKEN_URL = `${MES_API_BASE}/api/identity/oauth/token`;

const CLIENT_ID = process.env.MES_CLIENT_ID || 'boletadigitalclientid';
const CLIENT_SECRET = process.env.MES_CLIENT_SECRET || '';
const USERNAME = process.env.MES_USERNAME || 'boleta.digital@mes.gob.cu';
const PASSWORD = process.env.MES_PASSWORD || '';

async function getAccessToken(): Promise<string | null> {
  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', USERNAME);
    params.append('password', PASSWORD);
    params.append('scope', 'read');

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.access_token || data.token || null;
    }
  } catch (e) {
    console.error('[Pregrade API] Error obteniendo token:', e);
  }
  return null;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = { 'Accept': '*/*' };
    if (token) {
      headers['JWT'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${MES_API_BASE}/api/portal/pregrade`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({
          careers: data,
          total: data.length,
          source: 'mes',
        });
      }
    }
  } catch (error) {
    console.error('[Pregrade API] Error consultando /api/portal/pregrade:', error);
  }

  return NextResponse.json({ careers: [], total: 0, source: 'fallback' }, { status: 500 });
}