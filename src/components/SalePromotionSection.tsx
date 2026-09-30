import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const SalePromotionSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#F5F4F0]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Large Typography & Copy (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block">
              ĐẶC QUYỀN THEO MÙA
            </span>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#111111] font-normal leading-[1.04] tracking-tight">
              ƯU ĐÃI ĐẾN <br />
              <span className="italic font-light">30%</span>
            </h2>

            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans max-w-md">
              Cơ hội sở hữu những mẫu may đo cốt lõi từ các đợt phát hành trước với mức giá ưu đãi chọn lọc. Số lượng giới hạn theo từng kích cỡ.
            </p>

            <div className="pt-2">
              <Link
                to="/shop?filter=sale"
                className="btn-luxury inline-flex items-center gap-2 group"
              >
                <span>MUA HÀNG ƯU ĐÃI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Fashion Image (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-200 border border-[#E8E8E8]">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
                alt="HV CLOTHING Seasonal Sale Editorial"
                loading="lazy"
                className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
