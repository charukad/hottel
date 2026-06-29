import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import About from '@/components/About';
import Rooms from '@/components/Rooms';
import Services from '@/components/Services';
import Activities from '@/components/Activities';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SectionDivider from '@/components/ui/SectionDivider';
import { fetchEvents, fetchRooms, fetchGalleryImages } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [events, rooms, galleryImages] = await Promise.all([
    fetchEvents(),
    fetchRooms(),
    fetchGalleryImages(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectionDivider variant="mist" />
        <Events events={events} />
        <SectionDivider variant="gradient" />
        <About />
        <SectionDivider variant="mist" />
        <Rooms rooms={rooms} />
        <SectionDivider variant="gradient" />
        <Services />
        <SectionDivider variant="mist" />
        <Activities />
        <SectionDivider variant="gradient" />
        <Gallery additionalImages={galleryImages} />
        <SectionDivider variant="mist" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
