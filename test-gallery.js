import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

const gallerySchema = new mongoose.Schema({
  alt: String,
  imageUrl: String,
  order: Number,
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

async function test() {
  try {
    console.log('Connecting...');
    await mongoose.connect(URI);
    console.log('Connected.');
    console.log('Querying gallery...');
    const docs = await Gallery.find().sort({ order: 1, createdAt: -1 }).lean();
    console.log('Found', docs.length, 'docs');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
