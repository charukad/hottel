export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const events = await withTimeout(
      (async () => {
        await connectDB();
        return Event.find().sort({ date: 1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/events'
    );
    return NextResponse.json(events);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    console.error('GET /api/events error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const event = await withTimeout(
      (async () => {
        await connectDB();
        const formData = await req.formData();
        
        const title = formData.get('title');
        const description = formData.get('description');
        const date = formData.get('date');
        const imageFile = formData.get('image');
        const existingImageUrl = formData.get('imageUrl') || '';

        if (!title || !description || !date) {
          throw new Error('Title, description, and date are required');
        }

        let imageUrl = existingImageUrl;
        if (imageFile && typeof imageFile !== 'string') {
          imageUrl = await uploadFile(imageFile, 'event');
        }

        return Event.create({ title, description, date, imageUrl });
      })(),
      API_TIMEOUT_MS,
      'POST /api/events'
    );

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    console.error('POST /api/events error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
