import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[450px] sm:h-[550px] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image with slight zoom on hover */}
      <img
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=85"
        alt="TIMELESS ESSENTIALS - Atelier Konte"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-70 scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Subtle Dark Vignette */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-neutral-300 font-medium mb-4">
            ATELIER EDITORIAL
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-4 text-white">
            TIMELESS ESSENTIALS
          </h2>

          <p className="text-sm sm:text-base font-light text-neutral-200 tracking-wide max-w-md mx-auto mb-8 leading-relaxed">
            Designed for everyday confidence. Vượt lên khỏi xu hướng nhất thời để định vị dấu ấn cá nhân đích thực.
          </p>

          <Link
            to="/shop?category=collection"
            className="btn-luxury-white"
          >
            DISCOVER COLLECTION
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
