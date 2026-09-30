import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight, Check } from 'lucide-react';
import { saveNewsletterSubscription } from '../lib/customer-submissions';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await saveNewsletterSubscription(email);
      setIsSubscribed(true);
      addToast('Đã lưu email đăng ký trải nghiệm HV CLOTHING', 'success');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Không thể lưu email đăng ký.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#111111] text-white py-20 lg:py-28 border-t border-neutral-900">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-xl mx-auto">
          
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-3">
            BẢN TIN ĐẶC QUYỀN
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-3">
            CẬP NHẬT XU HƯỚNG MỚI
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm font-light tracking-wide mb-10 leading-relaxed font-sans">
            Đăng ký để là người đầu tiên trải nghiệm các bộ sưu tập mới, ấn phẩm thời trang và ưu đãi riêng tư.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-xs tracking-wider uppercase font-medium">
                Cảm ơn bạn. Email đã được ghi nhận để nhận cập nhật từ HV CLOTHING.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ĐỊA CHỈ EMAIL CỦA BẠN"
                required
                disabled={isSubmitting}
                aria-label="Địa chỉ email đăng ký nhận bản tin"
                className="flex-1 px-4 py-3.5 bg-neutral-900 border border-neutral-700 sm:border-r-0 text-white text-xs font-light tracking-wider placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors uppercase rounded-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-white text-[#111111] hover:bg-neutral-200 text-xs tracking-[0.18em] uppercase font-medium transition-colors flex items-center justify-center gap-2 shrink-0 rounded-none"
              >
                <span>{isSubmitting ? 'ĐANG LƯU...' : 'ĐĂNG KÝ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {error && !isSubscribed && <p role="alert" className="mt-3 text-xs text-rose-300">{error}</p>}

          <p className="text-[10px] text-neutral-500 font-light mt-4 tracking-wider">
            Bạn có thể hủy đăng ký bất cứ lúc nào. Đọc Chính sách Quyền riêng tư của chúng tôi.
          </p>

        </div>
      </div>
    </section>
  );
};
