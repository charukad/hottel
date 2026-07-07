export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdminReq = searchParams.get('admin') === 'true';
    let query = { isActive: true };

    if (isAdminReq) {
      const auth = await protect(req);
      if (!auth.error) {
        query = {}; // Admin can see all reviews
      }
    }

    const reviews = await withTimeout(
      (async () => {
        await connectDB();
        return Review.find(query).sort({ date: -1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/reviews'
    );
    return NextResponse.json(reviews);
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
    const review = await withTimeout(
      (async () => {
        await connectDB();
        return Review.create(body);
      })(),
      API_TIMEOUT_MS,
      'POST /api/reviews'
    );

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}
