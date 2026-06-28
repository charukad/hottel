'use client';

import { motion } from 'framer-motion';
import './Activities.css';

const activities = [
  {
    title: 'Village Tour',
    desc: 'Walk through paddy fields, riverside paths, and the iconic Nine Arch Bridge black train bridge.',
    image: '/images/activity-village.jpg',
    placeholder: 'Add: Paddy fields or Nine Arch Bridge',
  },
  {
    title: 'Tea Plantation Tour',
    desc: 'Explore lush Ceylon tea estates and learn the art of tea plucking and processing.',
    image: '/images/activity-tea.jpg',
    placeholder: 'Add: Tea plantation workers or green hills',
  },
  {
    title: 'Dunhinda Waterfall Tour',
    desc: 'Journey to the majestic Dunhinda Falls surrounded by tropical rainforest.',
    image: '/images/activity-waterfall.jpg',
    placeholder: 'Add: Dunhinda waterfall cascade',
  },
  {
    title: 'Cabana Experience',
    desc: 'Relax in a nearby cabana nestled in nature — perfect for sunset moments.',
    image: '/images/activity-cabana.jpg',
    placeholder: 'Add: Nature cabana or outdoor lounge',
  },
  {
    title: 'Hela Weda Meditation Center',
    desc: 'Visit the nearby Sri Lankan Hela Weda meditation center for inner peace.',
    image: '/images/activity-meditation.jpg',
    placeholder: 'Add: Meditation center or serene temple',
  },
  {
    title: 'Secret Scenic Spots',
    desc: 'Discover hidden viewpoints and secret nature trails known only to locals.',
    image: '/images/activity-scenic.jpg',
    placeholder: 'Add: Hidden Ella viewpoint',
  },
];

const Activities = () => {
  return (
    <section id="activities" className="activities-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Explore Ella</span>
          <h2 className="section-title">Activities & Experiences</h2>
          <p className="section-subtitle">
            Unforgettable adventures in the heart of Sri Lankan hill country
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.title}
              className="activity-card card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -10 }}
            >
              <div className="activity-image">
                <img
                  src={activity.image}
                  alt={activity.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder activity-placeholder" style={{ display: 'none' }}>
                  {activity.placeholder}
                </div>
                <div className="activity-overlay">
                  <h3>{activity.title}</h3>
                </div>
              </div>
              <p className="activity-desc">{activity.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
