import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Thông báo giao hàng"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#111111] text-white text-[11px] font-medium tracking-[0.16em] uppercase overflow-hidden z-50 border-b border-neutral-800"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between">
            {/* Empty balance spacer */}
            <div className="w-5 hidden sm:block" />

            {/* Centered Message in Vietnamese */}
            <div className="flex-1 flex items-center justify-center gap-3 text-center truncate">
              <span className="text-neutral-200">
                MIỄN PHÍ GIAO HÀNG TOÀN QUỐC CHO ĐƠN HÀNG TỪ 1.000.000₫
              </span>
              <Link
                to="/shop"
                className="underline underline-offset-2 hover:text-neutral-400 transition-colors hidden md:inline-block font-semibold"
              >
                MUA NGAY
              </Link>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-neutral-400 hover:text-white p-1 transition-colors ml-2"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
