export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { protect } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const result = await withTimeout(
      (async () => {
        const { id } = await params;
        await connectDB();
        const event = await Event.findById(id);
        if (!event) throw new Error('Event not found');

        const formData = await req.formData();
        
        const title = formData.get('title');
        const description = formData.get('description');
        const date = formData.get('date');
        const imageFile = formData.get('image');
        const existingImageUrl = formData.get('imageUrl');

        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;

        if (imageFile && typeof imageFile !== 'string') {
          if (event.imageUrl) await deleteFile(event.imageUrl);
          event.imageUrl = await uploadFile(imageFile, 'event');
        } else if (existingImageUrl !== undefined) {
          event.imageUrl = existingImageUrl;
        }

        await event.save();
        return event;
      })(),
      API_TIMEOUT_MS,
      'PUT /api/events/[id]'
    );

    return NextResponse.json(result);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('PUT /api/events/[id] error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await withTimeout(
      (async () => {
        const { id } = await params;
        await connectDB();
        const event = await Event.findById(id);
        if (!event) throw new Error('Event not found');

        if (event.imageUrl) await deleteFile(event.imageUrl);
        await event.deleteOne();
      })(),
      API_TIMEOUT_MS,
      'DELETE /api/events/[id]'
    );

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('DELETE /api/events/[id] error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
