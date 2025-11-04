// Temporary simple auth without NextAuth - Replace with proper auth when backend is ready
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mock authentication
    if (body.email === 'demo@dashboard.com' && body.password === 'demo123') {
      return NextResponse.json({
        user: {
          id: '1',
          email: 'demo@dashboard.com',
          name: 'Demo User',
          role: 'admin',
        },
        accessToken: 'mock-token',
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'session') {
    return NextResponse.json({ user: null });
  }

  if (action === 'providers') {
    return NextResponse.json({});
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
