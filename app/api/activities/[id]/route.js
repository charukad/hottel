import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/lib/models/Activity';
import { protect } from '@/lib/auth';
import { deleteFile, uploadFile } from '@/lib/upload';
import { withTimeout } from '@/lib/with-timeout';

const API_TIMEOUT_MS = 15000;

export async function PUT(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const updatedActivity = await withTimeout(
      (async () => {
        await connectDB();
        const activity = await Activity.findById(params.id);
        if (!activity) throw new Error('Activity not found');

        const formData = await req.formData();
        activity.title = formData.get('title') || activity.title;
        activity.description = formData.get('description') || activity.description;
        activity.order = formData.has('order') ? Number(formData.get('order')) : activity.order;
        activity.isActive = formData.has('isActive') ? formData.get('isActive') !== 'false' : activity.isActive;

        const imageFile = formData.get('image');
        if (imageFile && typeof imageFile !== 'string') {
          if (activity.imageUrl) {
            await deleteFile(activity.imageUrl);
          }
          activity.imageUrl = await uploadFile(imageFile, 'activities');
        }

        await activity.save();
        return activity;
      })(),
      API_TIMEOUT_MS,
      `PUT /api/activities/${params.id}`
    );

    return NextResponse.json(updatedActivity);
  } catch (error) {
    const status = error.message === 'Activity not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await withTimeout(
      (async () => {
        await connectDB();
        const activity = await Activity.findById(params.id);
        if (!activity) throw new Error('Activity not found');

        if (activity.imageUrl) {
          await deleteFile(activity.imageUrl);
        }

        await activity.deleteOne();
      })(),
      API_TIMEOUT_MS,
      `DELETE /api/activities/${params.id}`
    );

    return NextResponse.json({ message: 'Activity removed' });
  } catch (error) {
    const status = error.message === 'Activity not found' ? 404
      : error.message.includes('timed out') ? 503
      : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
