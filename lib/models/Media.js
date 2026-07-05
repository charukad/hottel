import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    altText: {
      type: String,
      default: 'Mountain Breeze Villa Media',
    },
    folder: {
      type: String,
      default: 'general',
    },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
