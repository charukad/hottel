export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { protect } from '@/lib/auth';
import { uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 60000;

export async function GET() {
  try {
    const mediaList = await withTimeout(
      (async () => {
        await connectDB();
        return Media.find().sort({ createdAt: -1 });
      })(),
      API_TIMEOUT_MS,
      'GET /api/media'
    );
    return NextResponse.json(mediaList);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    console.error('GET /api/media error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const mediaItem = await withTimeout(
      (async () => {
        await connectDB();
        const formData = await req.formData();
        
        const altText = formData.get('altText') || 'Media Upload';
        const folder = formData.get('folder') || 'general';
        const imageFile = formData.get('image');

        if (!imageFile || typeof imageFile === 'string') {
          throw new Error('Image file is required');
        }

        const imageUrl = await uploadFile(imageFile, folder);
        
        return Media.create({
          url: imageUrl,
          altText,
          folder,
          // If we had a cloud provider that returned publicIds, we'd store it here. 
          // For now, url is sufficient.
        });
      })(),
      API_TIMEOUT_MS,
      'POST /api/media'
    );

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('required') ? 400
      : 500;
    console.error('POST /api/media error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
