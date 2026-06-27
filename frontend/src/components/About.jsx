import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container about-grid">
        <motion.div
          className="about-image card"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="image-placeholder about-placeholder">
            Add: Villa garden or eco-friendly interior
          </div>
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Our Story</span>
          <h2 className="section-title about-title">A Peaceful Escape in Ella</h2>
          <p>
            Nestled among the misty hills of Ella, Mountain Breeze Villa offers a
            sanctuary where luxury meets sustainability. Our eco-friendly retreat is
            designed to harmonize with the surrounding mountains, tea plantations, and
            pristine nature.
          </p>
          <p>
            Wake to birdsong, breathe fresh mountain air, and experience authentic Sri
            Lankan hospitality. We use solar energy, organic toiletries, and locally
            sourced materials to minimize our footprint while maximizing your comfort.
          </p>
          <ul className="about-features">
            <li>🌱 100% eco-conscious practices</li>
            <li>🏔️ Panoramic mountain views</li>
            <li>🍃 Surrounded by tea country</li>
            <li>☕ Authentic Sri Lankan cuisine</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
