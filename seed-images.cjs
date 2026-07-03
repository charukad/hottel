const fsSync = require('fs');
const fs = require('fs/promises');

// Manually load .env.local
try {
  const envFile = fsSync.readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach(line => {
    if (line.includes('=')) {
      const [key, ...rest] = line.split('=');
      if (key.trim()) process.env[key.trim()] = rest.join('=').trim();
    }
  });
} catch (e) {
  console.log('.env.local not found or unreadable');
}
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

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
  console.log('Starting seedImages (CommonJS) script...');
  if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
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
      const altText = file.split('.')[0].replace(/-/g, ' ');
      const localUrl = `/images/${file}`;
      
      console.log(`Adding ${file} to MongoDB Gallery...`);
      
      await Gallery.create({
        alt: altText,
        imageUrl: localUrl,
        order: 0
      });
      
      console.log(`Saved ${file} to MongoDB Gallery.`);
    }

    console.log('All images have been saved to the database successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding images:', error);
    process.exit(1);
  }
}

seedImages();
