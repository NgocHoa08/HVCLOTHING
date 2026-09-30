import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  subtitle: string;
  to: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'WOMEN',
    subtitle: 'Vẻ đẹp thanh lịch & hiện đại',
    to: '/shop?gender=women',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'MEN',
    subtitle: 'Đường cắt may đo chuẩn mực',
    to: '/shop?gender=men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'NEW ARRIVALS',
    subtitle: 'Thiết kế mới nhất tuần này',
    to: '/shop?filter=new',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'ACCESSORIES',
    subtitle: 'Túi da & phụ kiện chế tác thủ công',
    to: '/shop?category=accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
];

export const CategorySection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-2">
            KHÁM PHÁ DANH MỤC
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal tracking-tight">
            SHOP BY CATEGORY
          </h2>
          <div className="w-12 h-[1px] bg-neutral-900 mx-auto mt-4" />
        </div>

        {/* 4 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group relative h-[420px] sm:h-[480px] overflow-hidden bg-neutral-200 border border-neutral-200/80 flex flex-col justify-end p-6"
            >
              {/* Background Image with Zoom */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Minimal Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-colors duration-500" />

              {/* Content */}
              <div className="relative z-10 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-light block mb-1">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif text-2xl lg:text-3xl font-medium tracking-wide mb-3">
                  {cat.name}
                </h3>
                <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-white/90 group-hover:text-white">
                  <span className="border-b border-white pb-0.5">EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
