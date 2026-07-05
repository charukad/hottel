export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const images = await withTimeout(
      (async () => {
        await connectDB();
        return Gallery.find().sort({ order: 1, createdAt: -1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/gallery'
    );
    return NextResponse.json(images);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    console.error('GET /api/gallery error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const image = await withTimeout(
      (async () => {
        await connectDB();
        
        // Handle both FormData (old way) and JSON (new Media Library way)
        const contentType = req.headers.get('content-type') || '';
        
        let alt, order, imageUrl;

        if (contentType.includes('application/json')) {
          const body = await req.json();
          alt = body.alt;
          order = body.order;
          imageUrl = body.imageUrl;
          
          if (!imageUrl) throw new Error('Image URL is required from Media Library');
        } else {
          const formData = await req.formData();
          alt = formData.get('alt');
          order = formData.get('order');
          const imageFile = formData.get('image');

          if (!imageFile || typeof imageFile === 'string') {
            throw new Error('Image file is required');
          }
          imageUrl = await uploadFile(imageFile, 'gallery');
        }

        if (!alt) {
          throw new Error('Image description (alt text) is required');
        }

        return Gallery.create({
          alt,
          imageUrl,
          order: order ? Number(order) : 0,
        });
      })(),
      API_TIMEOUT_MS,
      'POST /api/gallery'
    );

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    console.error('POST /api/gallery error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
