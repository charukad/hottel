'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import ScrollReveal from './ui/ScrollReveal';
import './Activities.css';

import { useState, useEffect } from 'react';
import api from '../lib/axios';
// Activities will be fetched dynamically from the DB

const Activities = () => {
  const scrollContainerRef = useRef(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get('/activities');
        setActivities(data.filter(a => a.isActive));
      } catch (e) {
        console.error('Failed to load activities', e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <section id="activities" className="activities-section">
      <div className="container">
        <ScrollReveal variant="slide-up">
          <div className="section-header">
            <span className="section-label">Explore Ella</span>
            <h2 className="section-title">Activities & Experiences</h2>
            <p className="section-subtitle">
              Unforgettable adventures in the heart of Sri Lankan hill country
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll timeline */}
      <div className="activities-scroll-container" ref={scrollContainerRef}>
        <div className="activities-track">
          {loading ? (
            <div className="spinner" style={{ margin: '2rem auto', alignSelf: 'center' }} />
          ) : activities.length === 0 ? (
            <p style={{ alignSelf: 'center', margin: '0 auto' }}>No activities available right now.</p>
          ) : (
            activities.map((activity, index) => (
              <motion.article
                key={activity._id}
                className="activity-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <div className="activity-image">
                  <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    style={{ objectFit: 'cover' }}
                    unoptimized={activity.imageUrl.startsWith('http')}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-placeholder activity-placeholder" style={{ display: 'none' }}>
                    Mountain Breeze Villa Activity
                  </div>
                  <div className="activity-overlay">
                    <h3>{activity.title}</h3>
                  </div>
                </div>
                <p className="activity-desc">{activity.description}</p>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Activities;
