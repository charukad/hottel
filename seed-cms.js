const mongoose = require('mongoose');

// We need to use raw mongoose models here because we are running in Node outside of Next.js
const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  order: Number,
  isActive: Boolean
});

const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  order: Number,
  isActive: Boolean
});

const reviewSchema = new mongoose.Schema({
  guestName: String,
  text: String,
  rating: Number,
  source: String,
  isActive: Boolean
});

const settingSchema = new mongoose.Schema({
  hotelName: String,
  tagline: String,
  description: String,
  primaryColor: String,
  secondaryColor: String,
  logoUrl: String,
  faviconUrl: String,
  contactEmail: String,
  contactPhone: String,
  contactAddress: String,
  googleMapsUrl: String,
  socialFacebook: String,
  socialInstagram: String,
  socialTripAdvisor: String,
  socialWhatsapp: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
});

const heroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imageUrl: String,
  order: Number,
  isActive: Boolean
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSchema);

const seedCMS = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Seed Settings
    const existingSettings = await Setting.countDocuments();
    if (existingSettings === 0) {
      await Setting.create({
        hotelName: 'Mountain Breeze Villa',
        tagline: 'Eco-Friendly Mountain Retreat',
        description: 'A cinematic escape into the heart of Ella, Sri Lanka — where luxury meets the whisper of mountains',
        primaryColor: '#2b4c3b',
        secondaryColor: '#8fa87a',
        logoUrl: '/images/logo.png',
        contactEmail: 'info@mountainbreezevilla.com',
        contactPhone: '+94710743192',
        contactAddress: 'Mountain Breeze Villa, Ella, Uva Province, Sri Lanka',
        seoTitle: 'Mountain Breeze Villa – Ella, Sri Lanka',
        seoDescription: 'Mountain Breeze Villa – Eco-friendly luxury stay in Ella, Sri Lanka. Peaceful mountain retreat surrounded by nature.',
        seoKeywords: 'Ella hotel, Sri Lanka villa, eco-friendly stay, mountain retreat',
      });
      console.log('Added initial Settings');
    }

    // 2. Seed Services
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.insertMany([
        { title: 'Mini Bar', description: 'Curated selection of local and international beverages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21.5c-3 0-6-2.5-6-7.5 0-3 2.5-5 5-7.5 1-1 1-3 1-3s0 2 1 3c2.5 2.5 5 4.5 5 7.5 0 5-3 7.5-6 7.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>', order: 1, isActive: true },
        { title: 'Laundry', description: 'Fresh linens and laundry service for a worry-free stay', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 11.5c1.657 0 3-1.343 3-3V4H9v4.5c0 1.657 1.343 3 3 3zM12 11.5v9M19 4v16M5 4v16M5 4c1.105 0 2 .895 2 2v2H3V6c0-1.105.895-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>', order: 2, isActive: true },
        { title: 'Breakfast, Lunch & Dinner', description: 'Authentic Sri Lankan cuisine with fresh local ingredients', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11a3 3 0 100-6 3 3 0 000 6zM17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>', order: 3, isActive: true },
        { title: 'TV', description: 'Entertainment in the comfort of your room', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>', order: 4, isActive: true },
        { title: 'Tea & Coffee Maker', description: 'Premium Ceylon tea and freshly brewed coffee', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>', order: 5, isActive: true },
        { title: 'Hot Water', description: '24/7 hot water for your comfort', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', order: 6, isActive: true },
      ]);
      console.log('Added initial Services');
    }

    // 3. Seed Activities
    const existingActivities = await Activity.countDocuments();
    if (existingActivities === 0) {
      await Activity.insertMany([
        { title: 'Village Tour', description: 'Walk through paddy fields, riverside paths, and the iconic Nine Arch Bridge.', imageUrl: '/images/activity-village.jpg', order: 1, isActive: true },
        { title: 'Tea Plantation Tour', description: 'Explore lush Ceylon tea estates and learn the art of tea plucking.', imageUrl: '/images/activity-tea.jpg', order: 2, isActive: true },
        { title: 'Dunhinda Waterfall Tour', description: 'Journey to the majestic Dunhinda Falls surrounded by tropical rainforest.', imageUrl: '/images/activity-waterfall.jpg', order: 3, isActive: true },
        { title: 'Cabana Experience', description: 'Relax in a nearby cabana nestled in nature — perfect for sunset moments.', imageUrl: '/images/activity-cabana.jpg', order: 4, isActive: true },
        { title: 'Hela Weda Meditation', description: 'Visit the nearby Sri Lankan Hela Weda meditation center for inner peace.', imageUrl: '/images/activity-meditation.jpg', order: 5, isActive: true },
        { title: 'Secret Scenic Spots', description: 'Discover hidden viewpoints and secret nature trails known only to locals.', imageUrl: '/images/activity-scenic.jpg', order: 6, isActive: true },
      ]);
      console.log('Added initial Activities');
    }

    // 4. Seed Reviews
    const existingReviews = await Review.countDocuments();
    if (existingReviews === 0) {
      await Review.insertMany([
        { guestName: 'Sarah & Mark', text: 'The most stunning views we have ever seen. The eco-friendly approach makes this place truly special.', rating: 5, source: 'TripAdvisor', isActive: true },
        { guestName: 'David L.', text: 'Incredible food and hospitality. Waking up to the misty mountains was a dream come true.', rating: 5, source: 'Google', isActive: true },
      ]);
      console.log('Added initial Reviews');
    }

    // 5. Seed Hero
    const existingHero = await HeroSlide.countDocuments();
    if (existingHero === 0) {
      await HeroSlide.insertMany([
        { title: 'Mountain Breeze Villa', subtitle: 'Eco-Friendly Mountain Retreat', imageUrl: '/images/hero-villa-mountains.jpg', order: 1, isActive: true },
        { title: 'Lush Tea Plantations', subtitle: 'Explore the green heart of Sri Lanka', imageUrl: '/images/hero-tea-plantation.jpg', order: 2, isActive: true },
        { title: 'Serene Escapes', subtitle: 'Reconnect with nature in luxury', imageUrl: '/images/hero-nature-retreat.jpg', order: 3, isActive: true },
      ]);
      console.log('Added initial Hero Slides');
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedCMS();
