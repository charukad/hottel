import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/lib/models/HeroSlide';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';
import { uploadFile } from '@/lib/upload';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const slides = await withTimeout(
      (async () => {
        await connectDB();
        return HeroSlide.find().sort({ order: 1, createdAt: -1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/hero'
    );
    return NextResponse.json(slides);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const slide = await withTimeout(
      (async () => {
        await connectDB();
        const formData = await req.formData();
        
        const title = formData.get('title') || '';
        const subtitle = formData.get('subtitle') || '';
        const order = formData.get('order');
        const isActive = formData.get('isActive') !== 'false';
        const imageFile = formData.get('image');

        if (!imageFile || typeof imageFile === 'string') {
          throw new Error('Image file is required');
        }

        const imageUrl = await uploadFile(imageFile, 'hero');
        
        return HeroSlide.create({
          title,
          subtitle,
          imageUrl,
          order: order ? Number(order) : 0,
          isActive
        });
      })(),
      API_TIMEOUT_MS,
      'POST /api/hero'
    );

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
