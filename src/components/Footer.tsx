import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon } from './Icons';
import { ChevronDown } from 'lucide-react';

export const Footer: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleMobileCol = (col: string) => {
    setOpenAccordion((prev) => (prev === col ? null : col));
  };

  return (
    <footer className="w-full bg-[#111111] text-white pt-18 pb-12 border-t border-neutral-900">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-neutral-800">
          
          {/* Column 1: HV CLOTHING & Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="HV CLOTHING"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm font-sans pt-1">
              Thương hiệu thời trang cao cấp tôn vinh phom dáng thanh thoát, chất liệu tinh tuyển và khẳng định phong cách riêng biệt của bạn.
            </p>
          </div>

          {/* Column 2: SHOP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            {/* Desktop header / Mobile accordion trigger */}
            <div
              onClick={() => toggleMobileCol('shop')}
              className="flex items-center justify-between cursor-pointer md:cursor-default pb-2 md:pb-0 border-b border-neutral-800 md:border-b-0"
            >
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-white">
                CỬA HÀNG
              </h4>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 md:hidden transition-transform ${
                  openAccordion === 'shop' ? 'rotate-180' : ''
                }`}
              />
            </div>

            <ul
              className={`space-y-2.5 text-xs text-neutral-400 font-light ${
                openAccordion === 'shop' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link to="/shop?filter=new" className="hover:text-white transition-colors">
                  Hàng mới về
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-white transition-colors">
                  Thời trang Nữ
                </Link>
              </li>
              <li>
                <Link to="/category/men" className="hover:text-white transition-colors">
                  Thời trang Nam
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="hover:text-white transition-colors">
                  Phụ kiện &amp; Giày
                </Link>
              </li>
              <li>
                <Link to="/shop?category=collections" className="hover:text-white transition-colors">
                  Bộ sưu tập
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div
              onClick={() => toggleMobileCol('help')}
              className="flex items-center justify-between cursor-pointer md:cursor-default pb-2 md:pb-0 border-b border-neutral-800 md:border-b-0"
            >
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-white">
                HỖ TRỢ
              </h4>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 md:hidden transition-transform ${
                  openAccordion === 'help' ? 'rotate-180' : ''
                }`}
              />
            </div>

            <ul
              className={`space-y-2.5 text-xs text-neutral-400 font-light ${
                openAccordion === 'help' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Đổi trả &amp; Hoàn tiền
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Hướng dẫn chọn size
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: FOLLOW (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div
              onClick={() => toggleMobileCol('follow')}
              className="flex items-center justify-between cursor-pointer md:cursor-default pb-2 md:pb-0 border-b border-neutral-800 md:border-b-0"
            >
              <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-white">
                KẾT NỐI
              </h4>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 md:hidden transition-transform ${
                  openAccordion === 'follow' ? 'rotate-180' : ''
                }`}
              />
            </div>

            <ul
              className={`space-y-2.5 text-xs text-neutral-400 font-light ${
                openAccordion === 'follow' ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright, Privacy Policy, Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-light gap-4">
          <p>© 2026 HV CLOTHING. Bảo lưu mọi quyền.</p>

          <div className="flex items-center space-x-6 text-[11px] text-neutral-400">
            <Link to="/about" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Hệ thống cửa hàng
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
