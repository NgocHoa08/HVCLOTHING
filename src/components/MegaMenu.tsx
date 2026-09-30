import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MegaMenuProps {
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 w-full bg-white border-b border-[#E8E8E8] shadow-dropdown z-40 py-10"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-8 items-start">
        
        {/* Column 1: NEW IN */}
        <div className="col-span-2 space-y-4">
          <Link
            to="/shop?filter=new"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#111111] hover:text-[#777777] transition-colors block pb-1 border-b border-neutral-100"
          >
            HÀNG MỚI VỀ
          </Link>
          <ul className="space-y-2.5 text-xs text-[#777777] font-light">
            <li>
              <Link to="/shop?filter=new" onClick={onClose} className="hover:text-black transition-colors">
                Tất cả hàng mới
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&filter=new" onClick={onClose} className="hover:text-black transition-colors">
                Hàng mới cho Nữ
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men&filter=new" onClick={onClose} className="hover:text-black transition-colors">
                Hàng mới cho Nam
              </Link>
            </li>
            <li>
              <Link to="/shop?filter=bestseller" onClick={onClose} className="hover:text-black transition-colors">
                Sản phẩm bán chạy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: WOMEN */}
        <div className="col-span-2 space-y-4">
          <Link
            to="/category/women"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#111111] hover:text-[#777777] transition-colors block pb-1 border-b border-neutral-100"
          >
            THỜI TRANG NỮ
          </Link>
          <ul className="space-y-2.5 text-xs text-[#777777] font-light">
            <li>
              <Link to="/category/women" onClick={onClose} className="hover:text-black transition-colors">
                Xem tất cả đồ Nữ
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&subcategory=Blazers" onClick={onClose} className="hover:text-black transition-colors">
                Áo Blazer may đo
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&subcategory=Shirts" onClick={onClose} className="hover:text-black transition-colors">
                Áo Sơ mi &amp; Kiểu
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&subcategory=Trousers" onClick={onClose} className="hover:text-black transition-colors">
                Quần Ống rộng
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&subcategory=Dresses" onClick={onClose} className="hover:text-black transition-colors">
                Đầm Lụa dáng suông
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women&subcategory=Knitwear" onClick={onClose} className="hover:text-black transition-colors">
                Áo Len Cashmere
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: MEN */}
        <div className="col-span-2 space-y-4">
          <Link
            to="/category/men"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#111111] hover:text-[#777777] transition-colors block pb-1 border-b border-neutral-100"
          >
            THỜI TRANG NAM
          </Link>
          <ul className="space-y-2.5 text-xs text-[#777777] font-light">
            <li>
              <Link to="/category/men" onClick={onClose} className="hover:text-black transition-colors">
                Xem tất cả đồ Nam
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men&subcategory=Shirts" onClick={onClose} className="hover:text-black transition-colors">
                Sơ mi Linen &amp; Oxford
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men&subcategory=Trousers" onClick={onClose} className="hover:text-black transition-colors">
                Quần Âu ống đứng
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men&subcategory=Outerwear" onClick={onClose} className="hover:text-black transition-colors">
                Áo Khoác ngoài
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men&subcategory=Knitwear" onClick={onClose} className="hover:text-black transition-colors">
                Áo Polo &amp; Dệt kim
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: ACCESSORIES */}
        <div className="col-span-2 space-y-4">
          <Link
            to="/category/accessories"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-[#111111] hover:text-[#777777] transition-colors block pb-1 border-b border-neutral-100"
          >
            PHỤ KIỆN &amp; GIÀY
          </Link>
          <ul className="space-y-2.5 text-xs text-[#777777] font-light">
            <li>
              <Link to="/category/accessories" onClick={onClose} className="hover:text-black transition-colors">
                Tất cả phụ kiện
              </Link>
            </li>
            <li>
              <Link to="/shop?category=accessories&subcategory=Bags" onClick={onClose} className="hover:text-black transition-colors">
                Túi da &amp; Ví cầm tay
              </Link>
            </li>
            <li>
              <Link to="/shop?category=accessories&subcategory=Shoes" onClick={onClose} className="hover:text-black transition-colors">
                Giày Da thủ công
              </Link>
            </li>
            <li>
              <Link to="/shop?category=accessories&subcategory=Small Goods" onClick={onClose} className="hover:text-black transition-colors">
                Thắt lưng, Khăn &amp; Kính
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: LARGE PROMOTIONAL IMAGE (4 cols) */}
        <div className="col-span-4">
          <Link
            to="/collection/spring-summer-2026"
            onClick={onClose}
            className="group relative aspect-[16/10] overflow-hidden bg-[#F7F7F5] border border-[#E8E8E8] block"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
              alt="Editorial Promo"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-light block mb-1">
                LOOKBOOK MÙA MỚI
              </span>
              <h4 className="font-serif text-lg font-normal mb-2">
                Bộ Sưu Tập Xuân / Hè 2026
              </h4>
              <span className="text-xs uppercase tracking-widest font-medium underline underline-offset-4 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>

      </div>
    </motion.div>
  );
};
