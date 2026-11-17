import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        name: session.name,
        lastName: session.lastName,
        identifier: session.identifier,
      },
    });
  } catch (error) {
    console.error('[AUTH ME] Error:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}