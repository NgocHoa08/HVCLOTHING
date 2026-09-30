import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const { addToast } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    document.title = 'Liên hệ — HV CLOTHING';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    addToast('Tin nhắn của bạn đã được gửi thành công đến HV CLOTHING Concierge', 'success');
  };

  return (
    <div className="w-full bg-white py-12 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#777777] font-medium block mb-2">
            CHĂM SÓC KHÁCH HÀNG &amp; BOUTIQUE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight">
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-light mt-3 leading-relaxed font-sans">
            Đội ngũ tư vấn phong cách của HV CLOTHING luôn sẵn sàng lắng nghe mọi thắc mắc về đơn hàng, chọn size và dịch vụ may đo riêng.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* LEFT: Contact Information & Boutiques (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Hanoi Flagship */}
            <div className="p-6 bg-[#F7F7F5] border border-[#E8E8E8] space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-medium block">
                CỬA HÀNG FLAGSHIP — HÀ NỘI
              </span>
              <h3 className="font-serif text-xl text-[#111111] font-normal">HV CLOTHING Tràng Tiền</h3>
              <div className="text-xs text-[#555555] font-light space-y-2 pt-1 font-sans">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>Số 18 Phố Tràng Tiền, Quận Hoàn Kiếm, Hà Nội</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>+84 (0) 24 3828 4334</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>09:00 — 21:30 (Thứ Hai — Chủ Nhật)</span>
                </p>
              </div>
            </div>

            {/* Saigon Flagship */}
            <div className="p-6 bg-[#F7F7F5] border border-[#E8E8E8] space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#777777] font-medium block">
                CỬA HÀNG FLAGSHIP — TP. HỒ CHÍ MINH
              </span>
              <h3 className="font-serif text-xl text-[#111111] font-normal">HV CLOTHING Đồng Khởi</h3>
              <div className="text-xs text-[#555555] font-light space-y-2 pt-1 font-sans">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <span>68 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. HCM</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>+84 (0) 28 3914 4334</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>09:30 — 22:00 (Thứ Hai — Chủ Nhật)</span>
                </p>
              </div>
            </div>

            {/* Direct Email */}
            <div className="p-4 border border-[#E8E8E8] text-xs text-[#555555] font-light">
              <p className="flex items-center gap-2 text-[#111111] font-medium mb-1">
                <Mail className="w-4 h-4" /> Bộ phận Chăm sóc Khách hàng
              </p>
              <p>Email: contact@hvclothing.vn — Hỗ trợ 24/7 trong 2 giờ làm việc.</p>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-[16/9] w-full bg-[#F7F7F5] border border-[#E8E8E8] flex flex-col items-center justify-center text-center p-4">
              <MapPin className="w-6 h-6 text-[#777777] mb-1.5" />
              <p className="font-serif text-sm text-[#111111]">Bản đồ hệ thống Flagship HV CLOTHING</p>
              <p className="text-[11px] text-[#777777] font-light mt-0.5">Boutique tọa lạc tại trung tâm Hà Nội &amp; TP. Hồ Chí Minh</p>
            </div>

          </div>

          {/* RIGHT: Contact Form (7 cols) */}
          <div className="lg:col-span-7 border border-[#E8E8E8] p-6 sm:p-10 bg-white">
            <h2 className="font-serif text-2xl text-[#111111] font-normal mb-2">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <p className="text-xs text-[#777777] font-light mb-8 font-sans">
              Điền thông tin và yêu cầu của bạn bên dưới, chúng tôi sẽ phản hồi sớm nhất.
            </p>

            {isSent ? (
              <div className="p-8 bg-[#F7F7F5] border border-[#E8E8E8] text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-[#111111] font-normal">Tin Nhắn Đã Được Gửi</h3>
                <p className="text-xs text-[#555555] font-light max-w-sm mx-auto">
                  Cảm ơn bạn. Chuyên viên chăm sóc khách hàng của HV CLOTHING sẽ liên hệ lại với bạn qua email hoặc số điện thoại.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="btn-luxury text-xs mt-4"
                >
                  GỬI TIN NHẮN MỚI
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Địa chỉ Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập yêu cầu tư vấn hoặc thông tin cần giải đáp..."
                    className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-luxury inline-flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>GỬI TIN NHẮN</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
