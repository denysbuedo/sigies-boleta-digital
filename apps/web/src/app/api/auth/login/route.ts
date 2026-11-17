import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Ingresa tu correo o número de celular'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || 'Datos de acceso incompletos';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { identifier, password } = result.data;
    const isEmail = identifier.includes('@');
    const cleanId = isEmail ? identifier.toLowerCase() : identifier.replace(/\D/g, '');

    // Buscar por correo o por teléfono
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: cleanId } : { phone: cleanId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Comprobar la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Crear sesión protegida en cookie
    await createSession({
      userId: user.id,
      name: user.name,
      lastName: user.lastName,
      identifier: (user.email || user.phone) as string,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        identifier: user.email || user.phone,
      },
    });
  } catch (error) {
    console.error('[AUTH LOGIN] Error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar el inicio de sesión' },
      { status: 500 }
    );
  }
}