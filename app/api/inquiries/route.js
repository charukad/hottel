export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const inquiries = await withTimeout(
      (async () => {
        await connectDB();
        return Inquiry.find().sort({ createdAt: -1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/inquiries'
    );
    return NextResponse.json(inquiries);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    // No auth required for POST - public users submit inquiries
    const body = await req.json();
    const inquiry = await withTimeout(
      (async () => {
        await connectDB();
        return Inquiry.create(body);
      })(),
      API_TIMEOUT_MS,
      'POST /api/inquiries'
    );

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}
