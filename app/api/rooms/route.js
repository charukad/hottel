export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const rooms = await withTimeout(
      (async () => {
        await connectDB();
        return Room.find().sort({ type: 1, name: 1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/rooms'
    );
    return NextResponse.json(rooms);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    console.error('GET /api/rooms error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const room = await withTimeout(
      (async () => {
        await connectDB();
        const formData = await req.formData();
        
        const name = formData.get('name');
        const type = formData.get('type');
        const price = formData.get('price');
        const description = formData.get('description');
        const features = formData.get('features');
        const imageFile = formData.get('image');
        const existingImageUrl = formData.get('imageUrl') || '';

        if (!name || !type || !price || !description) {
          throw new Error('Name, type, price, and description are required');
        }

        let imageUrl = existingImageUrl;
        if (imageFile && typeof imageFile !== 'string') {
          imageUrl = await uploadFile(imageFile, 'room');
        }

        return Room.create({
          name,
          type,
          price: Number(price),
          description,
          features: features ? JSON.parse(features) : [],
          images: imageUrl ? [imageUrl] : [],
        });
      })(),
      API_TIMEOUT_MS,
      'POST /api/rooms'
    );

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    console.error('POST /api/rooms error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
