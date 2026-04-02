import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment
    const validUser = process.env.STUDIO_USERNAME;
    const validPassword = process.env.STUDIO_PASSWORD;

    // Check if auth is configured
    if (!validUser || !validPassword) {
      return NextResponse.json(
        { message: 'Authentication not configured' },
        { status: 503 }
      );
    }

    // Validate credentials
    if (username === validUser && password === validPassword) {
      // Create a session token (simple approach - in production, use JWT)
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // Set secure cookie
      const cookieStore = await cookies();
      cookieStore.set('studio_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    // Invalid credentials
    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
