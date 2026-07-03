export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
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
        const room = await Room.findById(id);
        if (!room) throw new Error('Room not found');

        const formData = await req.formData();
        
        const name = formData.get('name');
        const type = formData.get('type');
        const price = formData.get('price');
        const description = formData.get('description');
        const features = formData.get('features');
        const imageFile = formData.get('image');
        const existingImageUrl = formData.get('imageUrl');

        if (name) room.name = name;
        if (type) room.type = type;
        if (price) room.price = Number(price);
        if (description) room.description = description;
        if (features) room.features = JSON.parse(features);

        if (imageFile && typeof imageFile !== 'string') {
          if (room.images?.[0]) await deleteFile(room.images[0]);
          const imageUrl = await uploadFile(imageFile, 'room');
          room.images = [imageUrl];
        } else if (existingImageUrl !== undefined) {
          room.images = existingImageUrl ? [existingImageUrl] : [];
        }

        await room.save();
        return room;
      })(),
      API_TIMEOUT_MS,
      'PUT /api/rooms/[id]'
    );

    return NextResponse.json(result);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('PUT /api/rooms/[id] error:', error.message);
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
        const room = await Room.findById(id);
        if (!room) throw new Error('Room not found');

        if (room.images?.[0]) {
          await deleteFile(room.images[0]);
        }

        await room.deleteOne();
      })(),
      API_TIMEOUT_MS,
      'DELETE /api/rooms/[id]'
    );

    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('DELETE /api/rooms/[id] error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
