import { motion } from 'framer-motion';
import './Services.css';

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
        <div className="section-header">
          <span className="section-label">Amenities</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Everything you need for a comfortable, memorable mountain stay
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="service-card card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
