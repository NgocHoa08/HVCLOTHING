import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-white border-t border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-[850px] mx-auto space-y-6">
          
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block">
            TRIẾT LÝ HV CLOTHING
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight leading-[1.12]">
            KIẾN TẠO VỚI CHỦ ĐÍCH
          </h2>

          <p className="text-base sm:text-xl text-[#555555] font-light leading-relaxed font-sans max-w-2xl mx-auto">
            HV CLOTHING sáng tạo những thiết kế nền tảng cho tủ đồ hiện đại thông qua sự thấu đáo, chất liệu tuyển chọn và phom dáng vượt thời gian. Tôn trọng từng chuyển động và cảm xúc tự nhiên của bạn.
          </p>

          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#777777] hover:border-[#777777] transition-colors"
            >
              <span>CÂU CHUYỆN THƯƠNG HIỆU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
