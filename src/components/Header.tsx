import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { MobileMenu } from './MobileMenu';
import { MegaMenu } from './MegaMenu';
import { AnnouncementBar } from './AnnouncementBar';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopMegaOpen, setIsShopMegaOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { cartCount, wishlist, setIsSearchOpen, setIsCartDrawerOpen, addToast } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopMegaOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname, location.search]);

  // Click outside to close account dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 03. TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 04. MAIN HEADER */}
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 border-b border-[#E8E8E8] ${
          isScrolled ? 'py-4 shadow-subtle' : 'py-6'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* DESKTOP HEADER (>= 1024px) */}
          <div className="hidden lg:grid grid-cols-12 items-center">
            
            {/* LEFT: Menu Navigation (5 cols) */}
            <nav className="col-span-5 flex items-center space-x-6 xl:space-x-8">
              <NavLink
                to="/shop?filter=new"
                className={({ isActive }) =>
                  `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity ${
                    isActive && location.search.includes('filter=new') ? 'active-nav' : ''
                  }`
                }
              >
                HÀNG MỚI
              </NavLink>

              {/* SHOP WITH MEGA MENU TRIGGER */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopMegaOpen(true)}
              >
                <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity flex items-center gap-1 ${
                      isActive && !location.search.includes('filter=new') ? 'active-nav' : ''
                    }`
                  }
                >
                  <span>CỬA HÀNG</span>
                  <ChevronDown className="w-3 h-3 text-[#777777] -mt-0.5" />
                </NavLink>
              </div>

              <NavLink
                to="/category/women"
                className={({ isActive }) =>
                  `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity ${
                    isActive ? 'active-nav' : ''
                  }`
                }
              >
                NỮ
              </NavLink>

              <NavLink
                to="/category/men"
                className={({ isActive }) =>
                  `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity ${
                    isActive ? 'active-nav' : ''
                  }`
                }
              >
                NAM
              </NavLink>

              <NavLink
                to="/shop?category=collections"
                className={({ isActive }) =>
                  `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity ${
                    isActive ? 'active-nav' : ''
                  }`
                }
              >
                BỘ SƯU TẬP
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link-novae text-[#111111] hover:opacity-70 transition-opacity ${
                    isActive ? 'active-nav' : ''
                  }`
                }
              >
                VỀ HV CLOTHING
              </NavLink>
            </nav>

            {/* CENTER: LOGO HV CLOTHING (2 cols) */}
            <div className="col-span-2 text-center flex items-center justify-center">
              <Link to="/" className="inline-flex items-center justify-center group py-0.5">
                <img
                  src="/logo.png"
                  alt="HV CLOTHING"
                  className="h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* RIGHT: Actions (5 cols) */}
            <div className="col-span-5 flex items-center justify-end space-x-6 xl:space-x-7">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#111111] hover:opacity-60 transition-opacity p-1"
                aria-label="Tìm kiếm sản phẩm"
                title="Tìm kiếm"
              >
                <Search className="w-[18px] h-[18px] stroke-[1.4]" />
              </button>

              {/* Account Dropdown / Link */}
              {user ? (
                <div
                  ref={accountMenuRef}
                  className="relative"
                  onMouseEnter={() => setIsAccountMenuOpen(true)}
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 text-[#111111] hover:opacity-80 transition-opacity p-1 cursor-pointer"
                    aria-label="Menu tài khoản"
                    aria-expanded={isAccountMenuOpen}
                  >
                    <User className="w-[18px] h-[18px] stroke-[1.4]" />
                    <span className="hidden xl:inline max-w-[110px] truncate text-[11px] font-medium tracking-wide">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-[#777] -ml-0.5 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu with seamless invisible hover bridge */}
                  <div
                    className={`absolute right-0 top-full pt-1.5 w-64 z-50 transition-all duration-200 ${
                      isAccountMenuOpen
                        ? 'opacity-100 pointer-events-auto translate-y-0'
                        : 'opacity-0 pointer-events-none -translate-y-1'
                    }`}
                  >
                    <div className="bg-white border border-[#E2E0DB] shadow-xl py-1.5 rounded-none">
                      <div className="px-4 py-2.5 border-b border-[#F0F0EE]">
                        <p className="text-[10px] text-[#777] uppercase tracking-wider">Tài khoản</p>
                        <p className="text-xs font-semibold text-[#111] truncate">{user.name || user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-[#263C36] text-white' : 'bg-[#EAEAEA] text-[#555]'
                        }`}>
                          {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                        </span>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#263C36] font-medium hover:bg-[#F7F7F5] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Trang quản trị (Admin)</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#333] hover:bg-[#F7F7F5] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#777]" />
                        <span>Thông tin tài khoản</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          void logout();
                          addToast('Đã đăng xuất tài khoản thành công', 'info');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#A43131] hover:bg-rose-50 transition-colors border-t border-[#F0F0EE] mt-1 cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/account"
                  className="text-[#111111] hover:opacity-60 transition-opacity p-1"
                  aria-label="Tài khoản khách hàng"
                  title="Đăng nhập / Đăng ký"
                >
                  <User className="w-[18px] h-[18px] stroke-[1.4]" />
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="text-[#111111] hover:opacity-60 transition-opacity p-1 relative"
                aria-label="Danh sách yêu thích"
                title="Yêu thích"
              >
                <Heart className="w-[18px] h-[18px] stroke-[1.4]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#111111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="text-[#111111] hover:opacity-60 transition-opacity p-1 relative flex items-center gap-1.5"
                aria-label="Giỏ hàng"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-[18px] h-[18px] stroke-[1.4]" />
                <span className="text-xs font-medium tracking-widest font-sans">
                  ({cartCount})
                </span>
              </button>
            </div>

          </div>

          {/* MOBILE & TABLET HEADER (< 1024px) */}
          <div className="flex lg:hidden items-center justify-between">
            {/* Hamburger on Left */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-[#111111] hover:opacity-70 transition-opacity"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6 stroke-[1.4]" />
            </button>

            {/* Logo Center */}
            <Link to="/" className="flex items-center justify-center py-0.5">
              <img
                src="/logo.png"
                alt="HV CLOTHING"
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Cart on Right */}
            <div className="flex items-center gap-3">
              <Link to="/account" className="p-1.5 text-[#111111] hover:opacity-70" aria-label="Tài khoản khách hàng">
                <User className="w-5 h-5 stroke-[1.4]" />
              </Link>
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-1.5 text-[#111111] hover:opacity-70 transition-opacity relative"
                aria-label={`Giỏ hàng (${cartCount})`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.4]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 bg-[#111111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* MEGA MENU FOR SHOP */}
        {isShopMegaOpen && (
          <MegaMenu onClose={() => setIsShopMegaOpen(false)} />
        )}
      </header>

      {/* MOBILE DRAWER */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

    </>
  );
};
