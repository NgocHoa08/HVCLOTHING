import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-white border-t border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Fashion Image (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#F7F7F5] border border-[#E8E8E8]">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                alt="The HV CLOTHING Journal Editorial"
                loading="lazy"
                className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-6 left-6 text-white text-[10px] tracking-[0.25em] uppercase bg-black/60 backdrop-blur-xs px-3 py-1 font-medium">
                TẠP CHÍ HV CLOTHING — ẤN PHẨM 01
              </div>
            </div>
          </div>

          {/* RIGHT: Text Content (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pl-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block">
              TẠP CHÍ THỜI TRANG HV CLOTHING
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal leading-[1.08] tracking-tight">
              TỐI GIẢN, NHƯNG <br />
              <span className="italic font-light">ĐẮT GIÁ.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans max-w-md">
              Thiết kế thấu đáo, chất liệu tinh tuyển và những phom dáng sống mãi qua các mùa thời trang. Chúng tôi không chạy theo xu hướng nhất thời, mà kiến tạo những giá trị bền vững cho phong cách của bạn.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="btn-luxury inline-flex items-center gap-2 group"
              >
                <span>TÌM HIỂU THÊM</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
