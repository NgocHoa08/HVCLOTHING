import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface InstaPost {
  id: string;
  image: string;
  caption: string;
  likes: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    caption: 'Studio fits: Kiến trúc của phom dáng may đo len hữu cơ thuần khiết.',
    likes: '1,420',
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    caption: 'Quần ống rộng với độ rủ mềm mại và cạp cao tôn dáng thanh thoát.',
    likes: '984',
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    caption: 'Chất liệu lụa tơ tằm nguyên bản dưới ánh sáng tự nhiên của studio.',
    likes: '2,110',
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    caption: 'Lookbook Xuân / Hè 2026 — chuẩn mực thời trang tối giản và sang trọng.',
    likes: '1,890',
  },
  {
    id: 'post-5',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Thời trang nam đương đại: Cầu vai chuẩn mực kết hợp nét phóng khoáng thanh lịch.',
    likes: '1,340',
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    caption: 'Túi tote da thủ công thuộc thảo mộc từ vùng Tuscany nước Ý.',
    likes: '3,050',
  },
];

export const InstagramSection: React.FC = () => {
  const [activePost, setActivePost] = useState<InstaPost | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight mb-1">
            @HV.CLOTHING
          </h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium">
            THEO DÕI HÀNH TRÌNH CỦA CHÚNG TÔI
          </p>
        </div>

        {/* 6 Columns Desktop, 3 Tablet, 2 Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTA_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative aspect-square bg-[#F7F7F5] overflow-hidden cursor-pointer"
            >
              <img
                src={post.image}
                alt="Instagram look"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Darken + Instagram Icon */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-3 text-center">
                <InstagramIcon className="w-5 h-5 mb-1.5 stroke-[1.5]" />
                <span className="text-[9px] tracking-[0.18em] uppercase font-medium">XEM ẢNH</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePost && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActivePost(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full bg-white flex flex-col md:flex-row overflow-hidden shadow-2xl border border-[#E8E8E8]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-black/70 hover:bg-black text-white transition-colors"
                aria-label="Đóng ảnh"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="w-full md:w-3/5 aspect-square bg-neutral-100">
                <img
                  src={activePost.image}
                  alt={activePost.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption & Post detail */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E8E8]">
                    <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-serif font-bold tracking-tight">
                      HV
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#111111]">@hv.clothing</p>
                      <p className="text-[10px] text-[#777777]">Fashion For Your Style</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#555555] font-light leading-relaxed mt-5">
                    {activePost.caption}
                  </p>

                  <div className="mt-4 text-xs text-[#777777]">
                    <span>❤️ {activePost.likes} lượt thích</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E8E8E8]">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-luxury text-[11px] w-full flex items-center justify-center gap-1.5"
                  >
                    <span>MỞ TRÊN INSTAGRAM</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
