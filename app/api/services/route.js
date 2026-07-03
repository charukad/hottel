import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/lib/models/Service';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const services = await withTimeout(
      (async () => {
        await connectDB();
        return Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/services'
    );
    return NextResponse.json(services);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const body = await req.json();
    const service = await withTimeout(
      (async () => {
        await connectDB();
        return Service.create(body);
      })(),
      API_TIMEOUT_MS,
      'POST /api/services'
    );

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}
