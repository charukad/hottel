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
import { fetchEvents, fetchRooms } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [events, rooms] = await Promise.all([fetchEvents(), fetchRooms()]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Events events={events} />
        <About />
        <Rooms rooms={rooms} />
        <Services />
        <Activities />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
