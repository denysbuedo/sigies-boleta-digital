import { NextResponse } from 'next/server';
import { getUniversityCatalog } from '@/features/universities/services/mes-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalog = await getUniversityCatalog();
  return NextResponse.json(catalog, { headers: { 'Cache-Control': 'no-store' } });
}
