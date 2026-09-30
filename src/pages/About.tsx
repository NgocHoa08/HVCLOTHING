import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = 'Về chúng tôi — HV CLOTHING';
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      title: 'CHẤT LƯỢNG',
      desc: 'Chỉ tuyển chọn những chất liệu tự nhiên thượng thặng: lụa tơ tằm Mulberry, len merino siêu mịn, cashmere Mông Cổ và lanh hữu cơ Pháp.',
    },
    {
      title: 'TỐI GIẢN',
      desc: 'Lược bỏ những chi tiết trang trí rườm rà. Mỗi đường cắt, nếp gấp và đường viền đều phục vụ cho sự tinh khiết và công năng trọn vẹn.',
    },
    {
      title: 'CHỦ ĐÍCH',
      desc: 'Thiết kế với chủ đích rõ ràng: tối ưu tỷ lệ cơ thể, tạo cảm giác thư thái và nâng niu từng chuyển động thường nhật.',
    },
    {
      title: 'VƯỢT THỜI GIAN',
      desc: 'Vượt lên trên các xu hướng mùa vụ ngắn ngủi để kiến tạo tủ đồ capsule trường tồn theo năm tháng cùng bạn.',
    },
  ];

  return (
    <div className="w-full bg-white py-12 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* 33. Hero Headline */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-3">
            TUYÊN NGÔN THƯƠNG HIỆU
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight mb-6">
            CÂU CHUYỆN ĐẰNG SAU HV CLOTHING
          </h1>
          <p className="text-[#555555] text-sm sm:text-base font-light leading-relaxed font-sans">
            Được thành lập với khát khao định nghĩa lại vẻ đẹp của trang phục thường nhật. Chúng tôi tin rằng thời trang thực sự xa xỉ không đến từ logo phô trương, mà ẩn chứa trong cảm giác êm dịu khi chạm vào sợi vải và phom dáng vừa vặn tự nhiên.
          </p>
        </div>

        {/* Large Fashion Image */}
        <div className="mb-24 aspect-[16/9] overflow-hidden bg-[#F7F7F5] border border-[#E8E8E8]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="The HV CLOTHING Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Story Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-28 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block">
              CHẾ TÁC THỦ CÔNG
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal leading-[1.12]">
              Sự Cân Bằng Giữa Thủ Công &amp; Hiện Đại
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed font-sans">
              Mỗi thiết kế của HV CLOTHING được phát triển qua hàng chục giờ hoàn thiện rập mẫu tại xưởng. Từng đường may giấu mép kiểu Pháp, cúc vỏ ốc tự nhiên và lớp lót lụa tơ tằm đều được kiểm tra nghiêm ngặt trước khi xuất xưởng.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="btn-luxury inline-flex items-center gap-2">
                <span>KHÁM PHÁ CÁC THIẾT KẾ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 aspect-[4/3] overflow-hidden bg-[#F7F7F5] border border-[#E8E8E8]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="HV CLOTHING Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values: QUALITY, SIMPLICITY, INTENTION, TIMELESSNESS */}
        <div className="pt-16 border-t border-[#E8E8E8]">
          <div className="text-center max-w-lg mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
              TRỤ CỘT CỐT LÕI
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
              GIÁ TRỊ CỦA CHÚNG TÔI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 bg-[#F7F7F5] border border-[#E8E8E8] space-y-3">
                <h3 className="font-serif text-xl font-normal text-[#111111] tracking-wider">
                  {v.title}
                </h3>
                <p className="text-xs text-[#555555] font-light leading-relaxed font-sans">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
