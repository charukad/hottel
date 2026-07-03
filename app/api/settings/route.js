export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/lib/models/Setting';
import { protect } from '@/lib/auth';
import { withTimeout } from '@/lib/with-timeout';
import { uploadFile } from '@/lib/upload';

const API_TIMEOUT_MS = 15000;

export async function GET() {
  try {
    const settings = await withTimeout(
      (async () => {
        await connectDB();
        let config = await Setting.findOne();
        if (!config) {
          config = await Setting.create({});
        }
        return config;
      })(),
      API_TIMEOUT_MS,
      'GET /api/settings'
    );
    return NextResponse.json(settings);
  } catch (error) {
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}

export async function PUT(req) {
  try {
    const auth = await protect(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const updatedSettings = await withTimeout(
      (async () => {
        await connectDB();
        
        let config = await Setting.findOne();
        if (!config) {
          config = await Setting.create({});
        }

        const formData = await req.formData();
        
        const updates = {};
        const fields = [
          'hotelName', 'tagline', 'description', 'primaryColor', 'secondaryColor',
          'contactEmail', 'contactPhone', 'contactAddress', 'googleMapsUrl',
          'socialFacebook', 'socialInstagram', 'socialTripAdvisor', 'socialWhatsapp',
          'seoTitle', 'seoDescription', 'seoKeywords'
        ];

        fields.forEach(field => {
          const val = formData.get(field);
          if (val !== null && val !== undefined) {
            updates[field] = val;
          }
        });

        // Handle file uploads for logo and favicon
        const logoFile = formData.get('logoFile');
        if (logoFile && typeof logoFile !== 'string') {
          updates.logoUrl = await uploadFile(logoFile, 'branding');
        }

        const faviconFile = formData.get('faviconFile');
        if (faviconFile && typeof faviconFile !== 'string') {
          updates.faviconUrl = await uploadFile(faviconFile, 'branding');
        }

        Object.assign(config, updates);
        await config.save();
        
        return config;
      })(),
      API_TIMEOUT_MS,
      'PUT /api/settings'
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('PUT /api/settings error:', error.message);
    const status = error.message.includes('timed out') ? 503 : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}
