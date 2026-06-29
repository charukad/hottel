import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import Event from '@/lib/models/Event';
import Gallery from '@/lib/models/Gallery';

export async function GET() {
  try {
    await connectDB();
    const [roomCount, eventCount, galleryCount] = await Promise.all([
      Room.countDocuments(),
      Event.countDocuments(),
      Gallery.countDocuments(),
    ]);
    return NextResponse.json({ roomCount, eventCount, galleryCount });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
