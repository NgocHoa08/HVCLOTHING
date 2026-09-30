import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, Search, Heart, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './Icons';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { wishlist, setIsSearchOpen, addToast } = useCart();
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer 85vw */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[85vw] max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E8E8E8]">
                <Link to="/" onClick={onClose} className="inline-flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="HV CLOTHING"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="font-serif tracking-[0.14em] text-lg font-medium text-[#111111]">
                    HV CLOTHING
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#777777] hover:text-[#111111] transition-colors"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons: Search, Account, Wishlist */}
              <div className="grid grid-cols-3 gap-2 py-4 border-b border-[#E8E8E8] text-xs">
                <button
                  onClick={() => {
                    onClose();
                    setIsSearchOpen(true);
                  }}
                  className="flex flex-col items-center justify-center py-2.5 bg-[#F7F7F5] text-[#111111] hover:bg-neutral-200 transition-colors"
                >
                  <Search className="w-4 h-4 mb-1" />
                  <span className="text-[10px] tracking-wider uppercase font-medium">TÌM KIẾM</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/account');
                  }}
                  className="flex flex-col items-center justify-center py-2.5 bg-[#F7F7F5] text-[#111111] hover:bg-neutral-200 transition-colors"
                >
                  <User className="w-4 h-4 mb-1" />
                  <span className="text-[10px] tracking-wider uppercase font-medium">
                    {user ? 'TÀI KHOẢN' : 'ĐĂNG NHẬP'}
                  </span>
                </button>

                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center py-2.5 bg-[#F7F7F5] text-[#111111] hover:bg-neutral-200 transition-colors relative"
                >
                  <Heart className="w-4 h-4 mb-1" />
                  <span className="text-[10px] tracking-wider uppercase font-medium">YÊU THÍCH</span>
                  {wishlist.length > 0 && (
                    <span className="absolute top-1.5 right-2 w-3.5 h-3.5 bg-black text-white text-[8px] rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>

              {user && (
                <div className="mt-3 p-3 bg-[#F7F7F5] border border-[#E8E8E8] rounded-sm text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#111] truncate max-w-[160px]">{user.name || user.email}</p>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.2 text-[8px] font-medium uppercase rounded ${
                        user.role === 'admin' ? 'bg-[#263C36] text-white' : 'bg-[#DDD] text-[#555]'
                      }`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate('/admin');
                          }}
                          className="px-2 py-1 bg-[#263C36] text-white text-[10px] uppercase tracking-wider font-medium inline-flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" />
                          Admin
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          void logout();
                          onClose();
                          addToast('Đã đăng xuất tài khoản', 'info');
                        }}
                        className="px-2 py-1 border border-neutral-300 text-rose-700 text-[10px] uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation Links with Accordion for Shop */}
              <nav className="py-6 flex flex-col space-y-1">
                <NavLink
                  to="/shop?filter=new"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>HÀNG MỚI</span>
                </NavLink>

                {/* Shop with accordion */}
                <div className="border-b border-neutral-100">
                  <div
                    onClick={() => setIsShopExpanded((prev) => !prev)}
                    className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] flex items-center justify-between cursor-pointer"
                  >
                    <span>CỬA HÀNG</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#777777] transition-transform ${
                        isShopExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isShopExpanded && (
                    <div className="pl-4 pb-3 space-y-2 text-xs text-[#555555] font-light">
                      <Link
                        to="/shop"
                        onClick={onClose}
                        className="block py-1 hover:text-black"
                      >
                        Tất cả sản phẩm
                      </Link>
                      <Link
                        to="/category/women"
                        onClick={onClose}
                        className="block py-1 hover:text-black"
                      >
                        Bộ sưu tập Nữ
                      </Link>
                      <Link
                        to="/category/men"
                        onClick={onClose}
                        className="block py-1 hover:text-black"
                      >
                        Bộ sưu tập Nam
                      </Link>
                      <Link
                        to="/category/accessories"
                        onClick={onClose}
                        className="block py-1 hover:text-black"
                      >
                        Phụ kiện &amp; Giày
                      </Link>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/category/women"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>NỮ</span>
                </NavLink>

                <NavLink
                  to="/category/men"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>NAM</span>
                </NavLink>

                <NavLink
                  to="/shop?category=collections"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>BỘ SƯU TẬP</span>
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>VỀ HV CLOTHING</span>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={onClose}
                  className="py-3 text-sm tracking-[0.14em] font-medium text-[#111111] border-b border-neutral-100 flex items-center justify-between"
                >
                  <span>LIÊN HỆ</span>
                </NavLink>
              </nav>
            </div>

            {/* Bottom Brand Info */}
            <div className="pt-6 border-t border-[#E8E8E8]">
              <div className="flex items-center gap-4 mb-3 text-[#111111]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-60 transition-opacity"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-[#777777] tracking-wider uppercase">
                FASHION FOR YOUR STYLE
              </p>
              <p className="text-[10px] text-[#999999] mt-0.5">
                © 2026 HV CLOTHING. Bảo lưu mọi quyền.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
