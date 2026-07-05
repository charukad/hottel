export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
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
        const image = await Gallery.findById(id);
        if (!image) throw new Error('Gallery image not found');

        const contentType = req.headers.get('content-type') || '';
        
        let alt, order, imageUrl;
        
        if (contentType.includes('application/json')) {
          const body = await req.json();
          alt = body.alt;
          order = body.order;
          imageUrl = body.imageUrl;
        } else {
          const formData = await req.formData();
          alt = formData.get('alt');
          order = formData.get('order');
          const imageFile = formData.get('image');
          if (imageFile && typeof imageFile !== 'string') {
            await deleteFile(image.imageUrl);
            imageUrl = await uploadFile(imageFile, 'gallery');
          }
        }

        if (alt) image.alt = alt;
        if (order !== null && order !== undefined) image.order = Number(order);
        if (imageUrl) image.imageUrl = imageUrl;

        await image.save();
        return image;
      })(),
      API_TIMEOUT_MS,
      'PUT /api/gallery/[id]'
    );

    return NextResponse.json(result);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('PUT /api/gallery/[id] error:', error.message);
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
        const image = await Gallery.findById(id);
        if (!image) throw new Error('Gallery image not found');

        await deleteFile(image.imageUrl);
        await image.deleteOne();
      })(),
      API_TIMEOUT_MS,
      'DELETE /api/gallery/[id]'
    );

    return NextResponse.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    const status = error.message.includes('timed out') ? 503
      : error.message.includes('not found') ? 404
      : 500;
    console.error('DELETE /api/gallery/[id] error:', error.message);
    return NextResponse.json({ message: error.message }, { status });
  }
}
