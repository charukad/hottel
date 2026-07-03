import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

// Load environment variables is handled by node --env-file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define schema inline to avoid Node ES module reparsing issues
const gallerySchema = new mongoose.Schema({
  alt: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);


const MONGODB_URI = process.env.MONGODB_URI;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

async function seedImages() {
  console.log('Starting seedImages script...');
  if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    console.log(`Reading images from ${IMAGES_DIR}...`);
    const files = await fs.readdir(IMAGES_DIR);

    
    // Filter out non-image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    console.log(`Found ${imageFiles.length} images to upload.`);

    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      
      console.log(`Uploading ${file} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'mountain_breeze/gallery',
        resource_type: 'auto'
      });

      console.log(`Successfully uploaded! URL: ${result.secure_url}`);
      
      // Save to MongoDB Gallery Collection
      const altText = file.split('.')[0].replace(/-/g, ' '); // e.g. "gallery-1" -> "gallery 1"
      
      await Gallery.create({
        alt: altText,
        imageUrl: result.secure_url,
        order: 0
      });
      
      console.log(`Saved ${file} to MongoDB Gallery.`);
    }

    console.log('All images have been uploaded and saved to the database successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding images:', error);
    process.exit(1);
  }
}

seedImages();
