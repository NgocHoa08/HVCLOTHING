import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[540px] sm:h-[640px] lg:h-[760px] overflow-hidden bg-[#F7F7F5] border-b border-[#E8E8E8]">
      {/* 08. Hero Image Animation: scale 1.05 -> 1 with smooth ease */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85"
          alt="HV CLOTHING Spring Summer Editorial"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Dark Vignette for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" />
      </motion.div>

      {/* Hero Content: Placed at Lower-Left */}
      <div className="relative z-10 max-w-[1280px] h-full mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-end pb-14 sm:pb-18 lg:pb-20">
        <div className="max-w-2xl text-white">
          
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 mb-3"
          >
            <span className="w-6 h-[1px] bg-white/80" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/90">
              BỘ SƯU TẬP MỚI
            </span>
          </motion.div>

          {/* Large Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-[84px] font-normal tracking-tight text-white leading-[1.04] mb-4"
          >
            NGHỆ THUẬT CỦA <br />
            <span className="italic font-light">SỰ THƯỜNG NHẬT</span>
          </motion.h1>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-200 text-sm sm:text-base font-light tracking-wide max-w-lg mb-8 leading-relaxed"
          >
            Những thiết kế tinh tuyển cho nhịp sống hiện đại. Khám phá vẻ đẹp thanh lịch vượt thời gian từ lụa tơ tằm, len cashmere thượng hạng và sợi lanh thuần khiết.
          </motion.p>

          {/* Call-To-Action Buttons (Delay 300ms) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="btn-luxury-white"
            >
              KHÁM PHÁ BỘ SƯU TẬP
            </Link>

            <Link
              to="/collection/spring-summer-2026"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white hover:text-neutral-300 font-medium py-3 px-4 transition-colors group"
            >
              <span>XEM LOOKBOOK MÙA MỚI</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
