import { NextResponse } from 'next/server';
import { getUniversityDetail, MesApiError } from '@/features/universities/services/mes-api';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const detail = await getUniversityDetail(params.id);
    if (!detail) {
      return NextResponse.json({ error: 'Universidad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(detail, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof MesApiError ? error.message : 'Error no esperado al consultar MES.';
    console.error(`[MES API] ${message}`);
    return NextResponse.json(
      { error: 'No se pudo cargar la información del MES. Comprueba la configuración o vuelve a intentarlo.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
