import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CollectionBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden flex items-center justify-center bg-[#111111] text-white">
      {/* Background Image with subtle scale on hover */}
      <img
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=85"
        alt="Spring Summer 2026 Collection"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-65 hover:scale-103 transition-transform duration-1000 ease-out"
      />

      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Text Center */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-300 font-medium block mb-3">
            BỘ SƯU TẬP XUÂN / HÈ 2026
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-4 text-white">
            CHUẨN MỰC THỜI TRANG MỚI
          </h2>

          <p className="text-xs sm:text-sm font-light text-neutral-200 tracking-wide max-w-md mx-auto mb-8 leading-relaxed font-sans">
            Những mảnh ghép hoàn hảo cho tủ đồ capsule đương đại: tự do, sắc bén và bền vững cùng thời gian.
          </p>

          <Link
            to="/shop?category=collections"
            className="btn-luxury-white"
          >
            KHÁM PHÁ BỘ SƯU TẬP
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
