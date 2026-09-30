import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { products } = useProducts();
  // Pick 2 featured products for the right column
  const editorialProducts = products.slice(1, 3); // Minimal Wool Blazer & Wide Leg Trousers

  return (
    <section className="py-20 lg:py-28 bg-[#F7F7F5] border-y border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E8E8E8]">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-2">
              LOOKBOOK SỐ 04
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              BỘ SƯU TẬP TIÊU BIỂU
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-xs sm:text-sm text-[#555555] font-light max-w-sm leading-relaxed">
            Sự phối ngẫu giữa phom dáng kiến trúc và kỹ thuật dệt truyền thống, tạo nên vẻ đẹp thuần khiết cho trang phục thường nhật.
          </p>
        </div>

        {/* Editorial Layout: Left Large Image + Right 2 Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT: 1 Large Editorial Image (6 cols) */}
          <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-200 border border-[#E8E8E8]">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
              alt="HV CLOTHING Featured Editorial Look"
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-xs flex items-center justify-between border border-[#E8E8E8]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#777777] block">
                  BỘ SƯU TẬP ĐẶC BIỆT
                </span>
                <h4 className="font-serif text-lg text-[#111111]">
                  Bộ Sưu Tập May Đo Tinh Tế
                </h4>
              </div>
              <Link
                to="/collection/spring-summer-2026"
                className="text-xs uppercase tracking-widest font-medium text-[#111111] hover:underline flex items-center gap-1 shrink-0 ml-4"
              >
                <span>KHÁM PHÁ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT: 2 Featured Products (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {editorialProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
