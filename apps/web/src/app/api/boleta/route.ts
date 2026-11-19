import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export interface PreferenceInput {
  careerName: string;
  universityName: string;
  universityAbbr: string;
  programType: string;
}

// 1. OBTENER LA BOLETA DEL USUARIO ACTUAL
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const boleta = await prisma.boleta.findUnique({
      where: { userId: session.userId },
      include: {
        preferences: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return NextResponse.json({
      hasBoleta: !!boleta,
      boleta: boleta || null,
      preferences: boleta?.preferences || [],
    });
  } catch (error) {
    console.error('[API BOLETA GET] Error:', error);
    return NextResponse.json({ error: 'Error al consultar boleta' }, { status: 500 });
  }
}

// 2. GUARDAR O MODIFICAR LA BOLETA
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { preferences, status = 'DRAFT' } = body as {
      preferences: PreferenceInput[];
      status?: 'DRAFT' | 'SUBMITTED';
    };

    if (!Array.isArray(preferences)) {
      return NextResponse.json({ error: 'Lista de preferencias inválida' }, { status: 400 });
    }

    if (preferences.length > 10) {
      return NextResponse.json({ error: 'La boleta solo permite un máximo de 10 opciones' }, { status: 400 });
    }

    // Validar que no haya carreras duplicadas
    const uniqueKeys = new Set(preferences.map((p) => `${p.careerName}-${p.universityAbbr}`));
    if (uniqueKeys.size !== preferences.length) {
      return NextResponse.json(
        { error: 'No puedes agregar la misma carrera de la misma universidad dos veces' },
        { status: 400 }
      );
    }

    // Transacción: Buscar o crear boleta y reemplazar preferencias
    const savedBoleta = await prisma.$transaction(async (tx) => {
      // 1. Obtener o crear la boleta del usuario
      let userBoleta = await tx.boleta.findUnique({
        where: { userId: session.userId },
      });

      if (!userBoleta) {
        userBoleta = await tx.boleta.create({
          data: {
            userId: session.userId,
            status,
          },
        });
      } else {
        userBoleta = await tx.boleta.update({
          where: { id: userBoleta.id },
          data: { status, updatedAt: new Date() },
        });
        // Limpiar preferencias previas para reescribirlas ordenadas
        await tx.boletaPreference.deleteMany({
          where: { boletaId: userBoleta.id },
        });
      }

      // 2. Insertar las opciones con su posición exacta (1..N)
      if (preferences.length > 0) {
        await tx.boletaPreference.createMany({
          data: preferences.map((p, index) => ({
            boletaId: userBoleta.id,
            position: index + 1,
            careerName: p.careerName,
            universityName: p.universityName,
            universityAbbr: p.universityAbbr,
            programType: p.programType,
          })),
        });
      }

      return tx.boleta.findUnique({
        where: { id: userBoleta.id },
        include: { preferences: { orderBy: { position: 'asc' } } },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Boleta guardada con éxito',
      boleta: savedBoleta,
    });
  } catch (error) {
    console.error('[API BOLETA POST] Error:', error);
    return NextResponse.json({ error: 'Error al procesar la boleta' }, { status: 500 });
  }
}