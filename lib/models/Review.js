import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  source: { type: String, default: 'Direct' }, // e.g. "TripAdvisor", "Google", "Direct"
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
