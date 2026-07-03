import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

export default Gallery;
