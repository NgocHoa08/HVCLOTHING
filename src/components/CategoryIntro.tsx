import React from 'react';

export const CategoryIntro: React.FC = () => {
  return (
    <section className="pt-24 pb-14 sm:pt-32 sm:pb-18 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-[650px] mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-3">
            THIẾT KẾ TINH TUYỂN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] font-normal tracking-tight mb-4">
            KHÁM PHÁ BỘ SƯU TẬP
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
            Phom dáng tinh giản, chất liệu thượng hạng và những thiết kế vượt thời gian đồng hành cùng bạn. Từng đường cắt may đều tôn vinh vẻ đẹp tự nhiên và thanh lịch.
          </p>
        </div>
      </div>
    </section>
  );
};
