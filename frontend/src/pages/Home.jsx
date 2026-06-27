import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Events from '../components/Events';
import About from '../components/About';
import Rooms from '../components/Rooms';
import Services from '../components/Services';
import Activities from '../components/Activities';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Events />
        <About />
        <Rooms />
        <Services />
        <Activities />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
