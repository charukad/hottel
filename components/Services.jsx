'use client';

import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import GlassCard from './ui/GlassCard';
import api from '../lib/api';
import './Services.css';
import './ui/GlassCard.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.filter(s => s.isActive));
      } catch (e) {
        console.error('Failed to load services', e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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
          {loading ? (
            <div className="spinner" style={{ gridColumn: '1 / -1', margin: '2rem auto' }} />
          ) : services.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No services available right now.</p>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="service-card" tilt={true} glow={true}>
                  <div className="service-icon" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </GlassCard>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
