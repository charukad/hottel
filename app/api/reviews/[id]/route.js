export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const body = await req.json();
    const review = await withTimeout(
      (async () => {
        await connectDB();
        return Review.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
      })(),
      API_TIMEOUT_MS,
      `PUT /api/reviews/${params.id}`
    );

    if (!review) return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    return NextResponse.json(review);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await withTimeout(
      (async () => {
        await connectDB();
        const review = await Review.findById(params.id);
        if (!review) throw new Error('Review not found');
        await review.deleteOne();
      })(),
      API_TIMEOUT_MS,
      `DELETE /api/reviews/${params.id}`
    );

    return NextResponse.json({ message: 'Review removed' });
  } catch (error) {
    const status = error.message === 'Review not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
