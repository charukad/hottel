import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  hotelName: { type: String, default: 'Mountain Breeze Villa' },
  tagline: { type: String, default: 'Eco-Friendly Mountain Retreat' },
  description: { type: String, default: 'A cinematic escape into the heart of Ella, Sri Lanka — where luxury meets the whisper of mountains.' },
  logoUrl: { type: String, default: '/images/logo.png' },
  faviconUrl: { type: String, default: '/favicon.ico' },
  primaryColor: { type: String, default: '#2b4c3b' },
  secondaryColor: { type: String, default: '#8fa87a' },
  contactEmail: { type: String, default: 'reservations@mountainbreeze.lk' },
  contactPhone: { type: String, default: '+94 77 123 4567' },
  contactAddress: { type: String, default: 'Waterfall Road, Ella, Sri Lanka' },
  mapLat: { type: Number, default: 6.8741 },
  mapLng: { type: Number, default: 81.0456 },
  googleMapsUrl: { type: String, default: 'https://maps.google.com/maps?q=6.8741,81.0456&hl=en&z=14&output=embed' },
  googlePlaceShareLink: { type: String, default: '' },
  socialFacebook: { type: String, default: '#' },
  socialInstagram: { type: String, default: '#' },
  socialTripAdvisor: { type: String, default: '#' },
  socialWhatsapp: { type: String, default: '#' },
  heroMode: { type: String, default: 'slider', enum: ['slider', 'video'] },
  heroVideoUrl: { type: String, default: '' },
  heroVideoSpeed: { type: Number, default: 1.0 },
  heroVideoPingPong: { type: Boolean, default: false },
  showRoomPrices: { type: Boolean, default: true },
  seoTitle: { type: String, default: 'Mountain Breeze Villa - Eco Retreat in Ella' },
  seoDescription: { type: String, default: 'Experience luxury eco-tourism in the misty mountains of Ella, Sri Lanka.' },
  seoKeywords: { type: String, default: 'hotel, ella, sri lanka, eco resort, mountain breeze, luxury villa' }
}, { timestamps: true });

// We only want a single settings document to exist in the collection
const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;
