import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Deluxe Double', 'Superior', 'Family'],
    },
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    available: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
