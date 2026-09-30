import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryGridItem {
  title: string;
  subtitle: string;
  image: string;
  to: string;
}

const CATEGORIES: CategoryGridItem[] = [
  {
    title: 'THỜI TRANG NỮ',
    subtitle: 'Phom Dáng May Đo & Lụa Tơ Tằm',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    to: '/category/women',
  },
  {
    title: 'THỜI TRANG NAM',
    subtitle: 'Đường May Chuẩn Mực & Linen Thượng Hạng',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    to: '/category/men',
  },
  {
    title: 'PHỤ KIỆN & GIÀY',
    subtitle: 'Da Thuộc Thủ Công & Giày Tinh Xảo',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    to: '/category/accessories',
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section className="pb-24 sm:pb-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              to={cat.to}
              className="group relative aspect-[3/4] overflow-hidden bg-[#F7F7F5] flex flex-col justify-end p-8"
            >
              {/* Image with 1 -> 1.04 Zoom on Hover */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />

              {/* Very Subtle Dark Gradient at Bottom for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />

              {/* Text Placed at Bottom with subtle translateY on hover */}
              <div className="relative z-10 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-light block mb-1">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif text-3xl lg:text-4xl font-normal tracking-wide mb-3">
                  {cat.title}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase font-medium text-white underline underline-offset-4">
                  <span>MUA NGAY</span>
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
