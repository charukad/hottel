export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/lib/models/Service';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const body = await req.json();
    const service = await withTimeout(
      (async () => {
        await connectDB();
        return Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
      })(),
      API_TIMEOUT_MS,
      `PUT /api/services/${params.id}`
    );

    if (!service) return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    return NextResponse.json(service);
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
        const service = await Service.findById(params.id);
        if (!service) throw new Error('Service not found');
        await service.deleteOne();
      })(),
      API_TIMEOUT_MS,
      `DELETE /api/services/${params.id}`
    );

    return NextResponse.json({ message: 'Service removed' });
  } catch (error) {
    const status = error.message === 'Service not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
