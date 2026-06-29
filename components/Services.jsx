'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import GlassCard from './ui/GlassCard';
import './Services.css';
import './ui/GlassCard.css';

const services = [
  { icon: '🍷', title: 'Mini Bar', desc: 'Curated selection of local and international beverages' },
  { icon: '👕', title: 'Laundry', desc: 'Fresh linens and laundry service for a worry-free stay' },
  { icon: '🍛', title: 'Breakfast, Lunch & Dinner', desc: 'Authentic Sri Lankan cuisine with fresh local ingredients' },
  { icon: '📺', title: 'TV', desc: 'Entertainment in the comfort of your room' },
  { icon: '☕', title: 'Tea & Coffee Maker', desc: 'Premium Ceylon tea and freshly brewed coffee' },
  { icon: '🚿', title: 'Hot Water', desc: '24/7 hot water for your comfort' },
];

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <ScrollReveal variant="blur">
          <div className="section-header">
            <span className="section-label">Amenities</span>
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Everything you need for a comfortable, memorable mountain stay
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="services-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
            >
              <GlassCard className="service-card" tilt={true} glow={true}>
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
