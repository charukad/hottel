export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const body = await req.json();
    const inquiry = await withTimeout(
      (async () => {
        await connectDB();
        return Inquiry.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
      })(),
      API_TIMEOUT_MS,
      `PUT /api/inquiries/${params.id}`
    );

    if (!inquiry) return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
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
        const inquiry = await Inquiry.findById(params.id);
        if (!inquiry) throw new Error('Inquiry not found');
        await inquiry.deleteOne();
      })(),
      API_TIMEOUT_MS,
      `DELETE /api/inquiries/${params.id}`
    );

    return NextResponse.json({ message: 'Inquiry removed' });
  } catch (error) {
    const status = error.message === 'Inquiry not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
