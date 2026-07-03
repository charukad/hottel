import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);

export default HeroSlide;
