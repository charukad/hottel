import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadFile = async (file, prefix) => {
  if (!file || typeof file === 'string') return null;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `mountain_breeze/${prefix}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } else {
    // Local fallback if Cloudinary is not configured
    const ext = file.name.split('.').pop();
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await import('fs').then(fs => fs.promises.mkdir(uploadDir, { recursive: true }));
    } catch (e) {
      // Ignore if exists
    }
    
    await writeFile(path.join(uploadDir, filename), buffer);
    return `/uploads/${filename}`;
  }
};

export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  if (fileUrl.includes('cloudinary.com') && useCloudinary) {
    try {
      const regex = /\/v\d+\/(.+)\.[a-zA-Z0-9]+$/;
      const match = fileUrl.match(regex);
      
      if (match && match[1]) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.error('Error deleting file from Cloudinary:', err);
    }
  } else if (fileUrl.startsWith('/uploads/')) {
    // Local fallback deletion
    try {
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      await unlink(filePath);
    } catch (err) {
      console.error('Error deleting local file:', err);
    }
  }
};
