export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Admin from '@/lib/models/Admin';
import { generateToken } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function POST(req) {
  try {
    const authData = await withTimeout(
      (async () => {
        await connectDB();
        const { username, password } = await req.json();

        const admin = await Admin.findOne({ username });
        if (!admin) {
          throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return {
          admin: {
            _id: admin._id,
            username: admin.username,
          },
          token: generateToken(admin._id),
        };
      })(),
      API_TIMEOUT_MS,
      'POST /api/auth/login'
    );

    return NextResponse.json(authData);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('Invalid credentials') ? 401
      : 500;
    console.error('POST /api/auth/login error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
