export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/lib/models/Activity';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';
import { uploadFile } from '@/lib/upload';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const activities = await withTimeout(
      (async () => {
        await connectDB();
        return Activity.find().sort({ order: 1, createdAt: 1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/activities'
    );
    return NextResponse.json(activities);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const activity = await withTimeout(
      (async () => {
        await connectDB();
        const formData = await req.formData();
        
        const title = formData.get('title') || '';
        const description = formData.get('description') || '';
        const order = formData.get('order');
        const isActive = formData.get('isActive') !== 'false';
        const imageFile = formData.get('image');

        if (!imageFile || typeof imageFile === 'string') {
          throw new Error('Image file is required');
        }

        const imageUrl = await uploadFile(imageFile, 'activities');
        
        return Activity.create({
          title,
          description,
          imageUrl,
          order: order ? Number(order) : 0,
          isActive
        });
      })(),
      API_TIMEOUT_MS,
      'POST /api/activities'
    );

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
