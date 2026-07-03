import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event';
import Room from '@/lib/models/Room';
import Gallery from '@/lib/models/Gallery';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const stats = await withTimeout(
      (async () => {
        await connectDB();
        const [eventsCount, roomsCount, galleryCount] = await Promise.all([
          Event.countDocuments(),
          Room.countDocuments(),
          Gallery.countDocuments(),
        ]);
        return { eventsCount, roomsCount, galleryCount };
      })(),
      API_TIMEOUT_MS,
      'GET /api/stats'
    );

    return NextResponse.json(stats);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    console.error('GET /api/stats error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
