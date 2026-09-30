import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useProducts } from '../context/useProducts';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ESC key to close & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen, setIsSearchOpen]);

  // Max 6 live search products
  const liveResults = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleViewAllResults = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white border-b border-[#E8E8E8] shadow-2xl pt-10 pb-12 px-6 sm:px-12 lg:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-[1280px] mx-auto">
              
              {/* Header inside search: ESC tip & Close */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E8E8E8]">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#777777] font-medium">
                  NHẤN ESC ĐỂ ĐÓNG
                </span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-[#777777] hover:text-[#111111] transition-colors"
                  aria-label="Đóng tìm kiếm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Large Input */}
              <form onSubmit={handleViewAllResults} className="mt-8">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] mb-6 font-normal">
                  BẠN ĐANG TÌM KIẾM ĐIỀU GÌ?
                </h3>

                <div className="relative flex items-center">
                  <Search className="w-6 h-6 text-[#777777] absolute left-0 stroke-[1.4]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên sản phẩm, chất liệu hoặc phom dáng..."
                    className="w-full pl-10 pr-12 py-3 bg-transparent text-lg sm:text-2xl font-serif text-[#111111] placeholder:text-[#AAAAAA] placeholder:font-sans placeholder:text-base border-b-2 border-[#111111] focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-0 text-xs text-[#777777] hover:text-[#111111] uppercase tracking-wider"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#777777] mr-1 uppercase tracking-wider text-[11px]">
                  Phổ biến:
                </span>
                {['Áo Blazer', 'Sơ mi Linen', 'Quần Ống rộng', 'Len Cashmere', 'Áo Khoác'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-[#F7F7F5] border border-[#E8E8E8] text-[#111111] hover:border-[#111111] transition-colors text-xs font-light"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Results (max 6 items) */}
              {query.trim() && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 text-xs">
                    <span className="text-[#777777]">
                      {liveResults.length} GỢI Ý SẢN PHẨM PHÙ HỢP VỚI &ldquo;{query}&rdquo;
                    </span>
                    {liveResults.length > 0 && (
                      <button
                        onClick={() => handleViewAllResults()}
                        className="text-[#111111] hover:underline inline-flex items-center gap-1 font-medium tracking-wider uppercase text-[11px]"
                      >
                        <span>XEM TẤT CẢ KẾT QUẢ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="font-serif text-xl text-[#111111]">
                        Không tìm thấy sản phẩm phù hợp
                      </p>
                      <p className="text-xs text-[#777777] font-light mt-1">
                        Thử tìm kiếm với từ khóa &quot;áo sơ mi&quot;, &quot;quần âu&quot;, &quot;túi da&quot; hoặc &quot;blazer&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {liveResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.slug)}
                          className="group cursor-pointer flex flex-col"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F7F5] mb-2 border border-[#E8E8E8]">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                            />
                          </div>
                          <span className="text-[9px] uppercase tracking-widest text-[#777777]">
                            {product.categoryLabel}
                          </span>
                          <h4 className="text-xs font-medium text-[#111111] line-clamp-1 group-hover:underline mt-0.5">
                            {product.name}
                          </h4>
                          <span className="text-xs font-serif font-medium text-[#111111] mt-1">
                            {formatPrice(product.salePrice ?? product.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
