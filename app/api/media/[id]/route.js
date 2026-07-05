export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { protect } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await connectDB();
    const id = params.id;
    
    // In a full implementation, you would also delete the file from the cloud provider or local filesystem here.
    // For now, we just remove the reference from the database.
    const deletedMedia = await Media.findByIdAndDelete(id);
    
    if (!deletedMedia) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/media/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete media' }, { status: 500 });
  }
}
