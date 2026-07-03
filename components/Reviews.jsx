"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import ScrollReveal from './ui/ScrollReveal';
import GlassCard from './ui/GlassCard';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews');
        setReviews(data.filter(r => r.isActive));
      } catch (e) {
        console.error('Failed to load reviews', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (!loading && reviews.length === 0) return null;

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <ScrollReveal variant="slide-up">
          <div className="section-header">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-subtitle">
              Heartwarming stories from our beautiful mountain retreat
            </p>
          </div>
        </ScrollReveal>

        <div className="reviews-grid">
          {loading ? (
            <div className="spinner" style={{ margin: '2rem auto', gridColumn: '1 / -1' }} />
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="review-card" tilt={false} glow={true}>
                  <div className="review-stars">{renderStars(review.rating)}</div>
                  <p className="review-text">"{review.text}"</p>
                  <div className="review-author">
                    <h4>{review.guestName}</h4>
                    <span className="review-source">{review.source}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
