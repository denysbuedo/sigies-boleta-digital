import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

// Esquema de validación con Zod
const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().trim().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    identifier: z.string().trim().min(5, 'Ingresa un correo válido o celular de 8 dígitos'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues[0]?.message || 'Datos de registro inválidos';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, lastName, identifier, password } = result.data;

    // Detectar si el identificador es correo o celular
    const isEmail = identifier.includes('@');
    const email = isEmail ? identifier.toLowerCase() : null;
    const phone = !isEmail ? identifier.replace(/\D/g, '') : null;

    if (!isEmail && (!phone || phone.length < 8)) {
      return NextResponse.json(
        { error: 'El número de celular debe tener al menos 8 dígitos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una cuenta registrada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este correo o celular' },
        { status: 409 }
      );
    }

    // Hashear la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario en PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        phone,
        passwordHash,
      },
    });

    // Iniciar sesión automáticamente en la cookie
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
    console.error('[AUTH REGISTER] Error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor al registrar la cuenta' },
      { status: 500 }
    );
  }
}