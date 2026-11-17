import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sigies_portal_jwt_secret_local_dev_2026_super_seguro'
);

const COOKIE_NAME = 'portal_session';

export interface UserSessionPayload {
  userId: string;
  name: string;
  lastName: string;
  identifier: string; // email o teléfono
}

/**
 * Crea una cookie de sesión HttpOnly y firma el token con 'jose'
 */
export async function createSession(payload: UserSessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });

  return token;
}

/**
 * Obtiene y valida la sesión actual desde la cookie HttpOnly
 */
export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    // Primero el token y segundo la clave secreta
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      lastName: payload.lastName as string,
      identifier: payload.identifier as string,
    };
  } catch {
    return null;
  }
}

/**
 * Elimina la cookie al cerrar sesión
 */
export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}