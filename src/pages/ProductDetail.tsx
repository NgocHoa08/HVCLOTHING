import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatPrice, formatSubcategory } from '../data/products';
import { useProducts } from '../context/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductBadge } from '../components/ProductBadge';
import { useCart } from '../context/CartContext';
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Check,
  Share2,
  Ruler,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist, addToast } = useCart();

  // Find by slug or id
  const product = products.find((p) => p.slug === slug || p.id === slug);

  // States
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isZoomActive, setIsZoomActive] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — HV CLOTHING`;
      setSelectedImageIdx(0);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || null);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <h2 className="font-serif text-3xl text-[#111111] mb-2 font-normal">
          Không Tìm Thấy Sản Phẩm
        </h2>
        <p className="text-xs text-[#777777] font-light max-w-sm mb-6">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã được chuyển vào kho lưu trữ của HV CLOTHING.
        </p>
        <Link to="/shop" className="btn-luxury text-xs">
          QUAY LẠI CỬA HÀNG
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Đã sao chép liên kết sản phẩm', 'info');
    }
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion((prev) => (prev === name ? null : name));
  };

  return (
    <div className="w-full bg-white py-8 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#777777] mb-8">
          <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-black transition-colors capitalize">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* 26. Desktop 60% Left, 40% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* 27. LEFT 60%: PRODUCT GALLERY (7 cols on 12-col grid = ~58-60%) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
            
            {/* Thumbnail Column (Desktop) */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible w-full md:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative aspect-[3/4] w-16 md:w-20 overflow-hidden bg-[#F7F7F5] transition-all border ${
                      selectedImageIdx === idx
                        ? 'border-[#111111] ring-1 ring-[#111111]'
                        : 'border-[#E8E8E8] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image with Zoom & Lightbox */}
            <div
              className="relative flex-1 aspect-[3/4] w-full bg-[#F7F7F5] overflow-hidden group cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              onMouseEnter={() => setIsZoomActive(true)}
              onMouseLeave={() => setIsZoomActive(false)}
            >
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isZoomActive ? 'scale-110' : 'scale-100'
                }`}
              />

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <ProductBadge badge={product.badge} inStock={product.inStock} />
              </div>

              {/* Mobile swipe counter indicator */}
              <div className="absolute bottom-4 right-4 bg-white/90 px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium text-[#111111]">
                {selectedImageIdx + 1} / {product.images.length}
              </div>
            </div>

          </div>

          {/* RIGHT 40%: PRODUCT INFORMATION (5 cols = ~40%) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Category & Availability */}
            <div className="flex items-center justify-between text-[11px] text-[#777777] uppercase tracking-[0.2em] mb-2 font-medium">
              <span>{product.categoryLabel} / {formatSubcategory(product.subcategory)}</span>
              <span className={product.inStock ? 'text-emerald-700 font-medium' : 'text-[#777777]'}>
                {product.inStock ? '● CÒN HÀNG' : '● HẾT HÀNG'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-2.5">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#777777] font-light">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Pricing */}
            <div className="mb-6 pb-6 border-b border-[#E8E8E8] flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-[#888888] line-through font-serif">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed mb-6 font-sans">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2">
                  <span className="text-[#777777] font-light">Màu sắc:</span>
                  <span className="font-medium text-[#111111]">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        selectedColor?.name === color.name
                          ? 'ring-2 ring-[#111111] ring-offset-2 scale-110'
                          : 'border-[#E8E8E8] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#f7f6f2'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector + Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2">
                  <span className="text-[#777777] font-light">Kích cỡ:</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#555555] hover:text-[#111111] underline lowercase"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>bảng size</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[46px] h-10 px-3 text-xs tracking-wider transition-all border ${
                        selectedSize === size
                          ? 'bg-[#111111] text-white border-[#111111] font-medium'
                          : 'bg-white text-[#111111] border-[#E8E8E8] hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#777777] font-light">
                Số lượng:
              </span>
              <div className="flex items-center border border-[#E8E8E8] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-[#555555] hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1.5 text-[#555555] hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: ADD TO BAG, BUY NOW, WISHLIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 btn-luxury ${
                    !product.inStock ? 'opacity-50 cursor-not-allowed bg-neutral-300' : ''
                  }`}
                >
                  {product.inStock ? 'THÊM VÀO TÚI' : 'HẾT HÀNG'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border border-[#E8E8E8] transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'hover:border-[#111111] text-[#111111] bg-white'
                  }`}
                  aria-label="Yêu thích"
                  title="Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 border border-[#E8E8E8] hover:border-[#111111] text-[#111111] bg-white transition-colors"
                  aria-label="Chia sẻ"
                  title="Chia sẻ"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full btn-luxury-outline text-xs"
                >
                  MUA NGAY
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-6 my-6 border-y border-[#E8E8E8] text-center text-[10px] text-[#777777] uppercase tracking-wider font-light">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#111111]" />
                <span>Giao miễn phí từ 1.000.000₫</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 border-x border-[#E8E8E8] px-1">
                <RotateCcw className="w-4 h-4 text-[#111111]" />
                <span>Đổi size trong 14 ngày</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span>100% Chế tác chính hãng</span>
              </div>
            </div>

            {/* Accordions: DESCRIPTION, DETAILS, SHIPPING & RETURNS, SIZE GUIDE */}
            <div className="space-y-1 text-xs">
              
              {/* DESCRIPTION */}
              <div className="border border-[#E8E8E8] bg-white">
                <button
                  onClick={() => toggleAccordion('desc')}
                  className="w-full px-4 py-3.5 text-left font-medium tracking-[0.14em] uppercase text-[#111111] flex items-center justify-between"
                >
                  <span>MÔ TẢ CHI TIẾT</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      activeAccordion === 'desc' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'desc' && (
                  <div className="px-4 pb-4 pt-1 text-[#555555] font-light leading-relaxed border-t border-neutral-100">
                    <p>{product.description}</p>
                    <p className="mt-2 font-medium text-[#111111]">
                      Thành phần chất liệu: <span className="font-light">{product.material}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="border border-[#E8E8E8] bg-white">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full px-4 py-3.5 text-left font-medium tracking-[0.14em] uppercase text-[#111111] flex items-center justify-between"
                >
                  <span>CHI TIẾT &amp; BẢO QUẢN</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      activeAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'details' && (
                  <div className="px-4 pb-4 pt-1 text-[#555555] font-light space-y-2 border-t border-neutral-100">
                    <ul className="list-disc list-inside space-y-1">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <p className="font-medium text-[#111111] pt-2">Hướng dẫn bảo quản:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {product.care.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SHIPPING & RETURNS */}
              <div className="border border-[#E8E8E8] bg-white">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full px-4 py-3.5 text-left font-medium tracking-[0.14em] uppercase text-[#111111] flex items-center justify-between"
                >
                  <span>GIAO HÀNG &amp; ĐỔI TRẢ</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      activeAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="px-4 pb-4 pt-1 text-[#555555] font-light space-y-1.5 border-t border-neutral-100 leading-relaxed">
                    <p>• Miễn phí giao hàng tiêu chuẩn cho đơn từ 1.000.000₫.</p>
                    <p>• Giao hỏa tốc trong 2-4 giờ tại nội thành Hà Nội &amp; TP.HCM.</p>
                    <p>• Hỗ trợ thử đồ tại nhà và đổi size miễn phí trong vòng 14 ngày.</p>
                  </div>
                )}
              </div>

              {/* SIZE GUIDE */}
              <div className="border border-[#E8E8E8] bg-white">
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="w-full px-4 py-3.5 text-left font-medium tracking-[0.14em] uppercase text-[#111111] flex items-center justify-between"
                >
                  <span>BẢNG THÔNG SỐ CHỌN SIZE</span>
                  <Ruler className="w-3.5 h-3.5 text-[#777777]" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E8E8E8]">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
                GỢI Ý PHỐI ĐỒ HOÀN HẢO
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal">
                Có Thể Bạn Sẽ Thích
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SIZE GUIDE POPUP */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl text-[#111111] mb-1 font-normal">
                Bảng Thông Số Chọn Size HV CLOTHING
              </h3>
              <p className="text-xs text-[#777777] font-light mb-6">
                Thông số chuẩn (cm). Form dáng được tinh chỉnh theo tỷ lệ cơ thể người Việt.
              </p>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse border border-[#E8E8E8]">
                  <thead>
                    <tr className="bg-[#F7F7F5] border-b border-[#E8E8E8] text-[#111111] uppercase tracking-wider text-[10px]">
                      <th className="p-2.5 border border-[#E8E8E8]">Kích cỡ</th>
                      <th className="p-2.5 border border-[#E8E8E8]">Vòng ngực</th>
                      <th className="p-2.5 border border-[#E8E8E8]">Vòng eo</th>
                      <th className="p-2.5 border border-[#E8E8E8]">Chiều cao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E8E8] text-[#555555]">
                    <tr>
                      <td className="p-2.5 font-medium text-[#111111] border border-[#E8E8E8]">XS</td>
                      <td className="p-2.5 border border-[#E8E8E8]">82 - 86 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">64 - 68 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">150 - 160 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[#111111] border border-[#E8E8E8]">S</td>
                      <td className="p-2.5 border border-[#E8E8E8]">86 - 90 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">68 - 72 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">155 - 165 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[#111111] border border-[#E8E8E8]">M</td>
                      <td className="p-2.5 border border-[#E8E8E8]">91 - 96 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">73 - 78 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">165 - 175 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[#111111] border border-[#E8E8E8]">L</td>
                      <td className="p-2.5 border border-[#E8E8E8]">97 - 102 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">79 - 84 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">170 - 180 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[#111111] border border-[#E8E8E8]">XL</td>
                      <td className="p-2.5 border border-[#E8E8E8]">103 - 108 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">85 - 90 cm</td>
                      <td className="p-2.5 border border-[#E8E8E8]">175 - 188 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E8E8] text-center">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="btn-luxury text-xs px-6 py-2"
                >
                  ĐÓNG
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white text-black rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white hover:text-black" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
