import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }, // e.g. "wifi", "restaurant", etc.
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
