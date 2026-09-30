import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MobileMenu } from './MobileMenu';
import { MegaMenu } from './MegaMenu';
import { AnnouncementBar } from './AnnouncementBar';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopMegaOpen, setIsShopMegaOpen] = useState(false);
  const { cartCount, wishlist, setIsSearchOpen, setIsCartDrawerOpen } = useCart();
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
  }, [location.pathname, location.search]);

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

              {/* Account */}
              <Link
                to="/account"
                className="text-[#111111] hover:opacity-60 transition-opacity p-1"
                aria-label="Tài khoản khách hàng"
                title="Tài khoản"
              >
                <User className="w-[18px] h-[18px] stroke-[1.4]" />
              </Link>

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
