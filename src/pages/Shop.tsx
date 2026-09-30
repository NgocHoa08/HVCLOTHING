import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export const Shop: React.FC = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ category?: string }>();

  // Params from route or query
  const categoryParam = routeParams.category || searchParams.get('category') || '';
  const filterParam = searchParams.get('filter') || '';
  const searchParam = searchParams.get('search') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subcategoryParam);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [priceTier, setPriceTier] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  // Sync state with URL
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (subcategoryParam) setSelectedSubcategory(subcategoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, subcategoryParam, searchParam]);

  useEffect(() => {
    document.title = 'Cửa hàng — HV CLOTHING';
    window.scrollTo(0, 0);
  }, []);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
  const allColors = [
    { name: 'Noir / Black', hex: '#111111' },
    { name: 'Optic White', hex: '#FFFFFF' },
    { name: 'Sand / Beige', hex: '#D7CEBE' },
    { name: 'Charcoal / Grey', hex: '#555555' },
    { name: 'Deep Indigo', hex: '#1C2942' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.categoryLabel.toLowerCase().includes(q);
        const matchesSub = product.subcategory.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSub && !matchesDesc) return false;
      }

      // Category
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'collections') {
          if (!product.isFeatured && !product.isNew) return false;
        } else if (product.category !== selectedCategory && product.gender !== selectedCategory) {
          return false;
        }
      }

      // Subcategory
      if (selectedSubcategory) {
        if (product.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
      }

      // Filter flags (new / bestseller / sale)
      if (filterParam === 'new') {
        if (!product.isNew && product.badge !== 'NEW') return false;
      }
      if (filterParam === 'bestseller') {
        if (!product.isBestSeller && product.badge !== 'BEST SELLER') return false;
      }
      if (filterParam === 'sale') {
        if (!product.salePrice && product.badge !== 'SALE') return false;
      }

      // Sizes
      if (selectedSizes.length > 0) {
        const matchSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!matchSize) return false;
      }

      // Color
      if (selectedColor) {
        const matchCol = product.colors.some((c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!matchCol) return false;
      }

      // Price Range
      const effectivePrice = product.salePrice ?? product.price;
      if (priceTier === 'under-1500') {
        if (effectivePrice >= 1500000) return false;
      } else if (priceTier === '1500-3000') {
        if (effectivePrice < 1500000 || effectivePrice > 3000000) return false;
      } else if (priceTier === 'above-3000') {
        if (effectivePrice <= 3000000) return false;
      }

      // Stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedSizes,
    selectedColor,
    priceTier,
    inStockOnly,
    sortBy,
    searchQuery,
    filterParam,
    products,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedSizes([]);
    setSelectedColor('');
    setPriceTier('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    selectedSizes.length > 0 ||
    Boolean(selectedColor) ||
    priceTier !== 'all' ||
    inStockOnly ||
    Boolean(searchQuery) ||
    Boolean(filterParam);

  const getPageTitle = () => {
    if (searchQuery) return `Kết quả cho "${searchQuery}"`;
    if (selectedCategory === 'women') return 'BỘ SƯU TẬP NỮ';
    if (selectedCategory === 'men') return 'BỘ SƯU TẬP NAM';
    if (selectedCategory === 'accessories') return 'PHỤ KIỆN & GIÀY';
    if (selectedCategory === 'collections') return 'BỘ SƯU TẬP THEO MÙA';
    if (filterParam === 'new') return 'HÀNG MỚI VỀ';
    if (filterParam === 'sale') return 'ƯU ĐÃI ĐẶC BIỆT';
    if (filterParam === 'bestseller') return 'SẢN PHẨM BÁN CHẠY';
    return 'TẤT CẢ SẢN PHẨM';
  };

  return (
    <div className="w-full bg-white py-10 sm:py-16 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header: Title & Subtext */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#777777] font-medium block mb-2">
            DANH MỤC SẢN PHẨM
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-normal tracking-tight mb-3">
            {getPageTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] font-light leading-relaxed font-sans">
            Khám phá trọn vẹn bộ sưu tập HV CLOTHING. Những thiết kế tinh giản mang phom dáng vượt thời gian.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8E8E8] text-xs">
          
          {/* LEFT: FILTER Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-colors text-xs font-medium tracking-[0.16em] uppercase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>BỘ LỌC {hasActiveFilters ? '•' : ''}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-[#777777] hover:text-[#111111] text-xs underline uppercase tracking-wider ml-1"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* RIGHT: SORT BY */}
          <div className="flex items-center gap-2.5">
            <span className="text-[#777777] uppercase tracking-[0.16em] text-[11px] hidden sm:inline font-medium">
              SẮP XẾP
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sắp xếp sản phẩm"
                className="appearance-none bg-white border border-[#E8E8E8] hover:border-[#111111] px-3.5 py-2 pr-8 text-xs font-normal focus:outline-none focus:border-[#111111] cursor-pointer rounded-none tracking-wide"
              >
                <option value="featured">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#777777] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Product Grid: 4 columns desktop, 2 columns mobile */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-[#E8E8E8] bg-[#F7F7F5] p-8">
            <h3 className="font-serif text-2xl text-[#111111] mb-2 font-normal">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-[#777777] font-light max-w-sm mx-auto mb-6">
              Không tìm thấy sản phẩm nào khớp với bộ lọc bạn đã chọn. Vui lòng thiết lập lại tiêu chí lọc.
            </p>
            <button onClick={handleClearAll} className="btn-luxury text-xs">
              XÓA TẤT CẢ TIÊU CHÍ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* 25. FILTER DRAWER (Mobile & Desktop) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsFilterDrawerOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[85vw] max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-r border-[#E8E8E8]"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E8E8E8]">
                  <h3 className="font-serif text-xl font-normal text-[#111111]">
                    BỘ LỌC TÙY CHỌN
                  </h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 text-[#777777] hover:text-[#111111]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-6 space-y-6 text-xs">
                  
                  {/* CATEGORY */}
                  <div>
                    <h4 className="font-medium uppercase tracking-[0.16em] mb-2.5 text-[#111111]">
                      DANH MỤC
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Tất cả', value: '' },
                        { label: 'Thời trang Nữ', value: 'women' },
                        { label: 'Thời trang Nam', value: 'men' },
                        { label: 'Phụ kiện & Giày', value: 'accessories' },
                      ].map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setSelectedCategory(c.value)}
                          className={`p-2.5 text-center border text-xs tracking-wider transition-colors ${
                            selectedCategory === c.value
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-[#F7F7F5] text-[#111111] border-[#E8E8E8] hover:border-[#111111]'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SIZE */}
                  <div>
                    <h4 className="font-medium uppercase tracking-[0.16em] mb-2.5 text-[#111111]">
                      KÍCH CỠ
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`min-w-[42px] h-9 px-2.5 border text-xs tracking-wider transition-colors ${
                            selectedSizes.includes(size)
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#111111]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COLOR */}
                  <div>
                    <h4 className="font-medium uppercase tracking-[0.16em] mb-2.5 text-[#111111]">
                      MÀU SẮC
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {allColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() =>
                            setSelectedColor((c) => (c === color.name ? '' : color.name))
                          }
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                            selectedColor === color.name
                              ? 'ring-2 ring-[#111111] ring-offset-2'
                              : 'border-[#E8E8E8] hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* PRICE */}
                  <div>
                    <h4 className="font-medium uppercase tracking-[0.16em] mb-2.5 text-[#111111]">
                      KHOẢNG GIÁ
                    </h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: 'Tất cả mức giá', value: 'all' },
                        { label: 'Dưới 1.500.000 ₫', value: 'under-1500' },
                        { label: '1.500.000 ₫ — 3.000.000 ₫', value: '1500-3000' },
                        { label: 'Trên 3.000.000 ₫', value: 'above-3000' },
                      ].map((t) => (
                        <label
                          key={t.value}
                          className="flex items-center gap-2.5 cursor-pointer text-[#555555] hover:text-[#111111]"
                        >
                          <input
                            type="radio"
                            name="filterPrice"
                            checked={priceTier === t.value}
                            onChange={() => setPriceTier(t.value)}
                            className="accent-[#111111]"
                          />
                          <span>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* AVAILABILITY */}
                  <div className="pt-2 border-t border-[#E8E8E8]">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-normal text-[#111111]">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="accent-[#111111] w-4 h-4"
                      />
                      <span>Chỉ hiển thị sản phẩm còn hàng</span>
                    </label>
                  </div>

                </div>
              </div>

              {/* Drawer Action Buttons: APPLY FILTERS, CLEAR ALL */}
              <div className="pt-4 border-t border-[#E8E8E8] flex gap-2.5">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-3 text-xs border border-[#E8E8E8] text-[#111111] uppercase tracking-[0.14em] font-medium hover:border-[#111111]"
                >
                  XÓA BỘ LỌC
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 text-xs bg-[#111111] text-white uppercase tracking-[0.14em] font-medium hover:bg-black"
                >
                  ÁP DỤNG ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
