import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, formatSubcategory } from '../data/products';
import { X, Star, Heart, Check, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, isInWishlist, toggleWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.images[0]);
      setSelectedSize(quickViewProduct.sizes[0] || 'M');
      setSelectedColor(quickViewProduct.colors[0] || null);
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity, false);
    closeQuickView();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-6"
        onClick={closeQuickView}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto border border-[#E8E8E8] shadow-2xl flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-[#111111] hover:text-white transition-colors"
            aria-label="Đóng xem nhanh"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Product Gallery (2 cols on desktop) */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col items-center bg-[#F7F7F5] border-b md:border-b-0 md:border-r border-[#E8E8E8]">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden bg-white mb-4">
              <img
                src={selectedImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5 w-full justify-center">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 sm:w-16 h-18 sm:h-20 overflow-hidden border bg-white transition-all ${
                      selectedImage === img
                        ? 'border-[#111111] ring-1 ring-[#111111]'
                        : 'border-[#E8E8E8] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Buying Info */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#777777] uppercase tracking-[0.2em] mb-1">
                <span>{quickViewProduct.categoryLabel} / {formatSubcategory(quickViewProduct.subcategory)}</span>
                <span className={quickViewProduct.inStock ? 'text-emerald-700 font-medium' : 'text-[#777777]'}>
                  {quickViewProduct.inStock ? 'CÒN HÀNG' : 'HẾT HÀNG'}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight mb-2">
                {quickViewProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#777777] font-light">
                  {quickViewProduct.rating} ({quickViewProduct.reviews} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="mb-5 flex items-baseline gap-3">
                {quickViewProduct.salePrice ? (
                  <>
                    <span className="font-serif text-2xl text-[#111111] font-medium">
                      {formatPrice(quickViewProduct.salePrice)}
                    </span>
                    <span className="text-sm text-[#888888] line-through font-serif">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-2xl text-[#111111] font-medium">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-[#555555] leading-relaxed font-light mb-6">
                {quickViewProduct.description}
              </p>

              {/* Color selector */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs tracking-wider uppercase mb-2">
                    <span className="text-[#777777]">Màu sắc:</span>
                    <span className="font-medium text-[#111111]">{selectedColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {quickViewProduct.colors.map((color) => (
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

              {/* Size selector */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs tracking-wider uppercase mb-2">
                    <span className="text-[#777777]">Kích cỡ:</span>
                    <span className="font-medium text-[#111111]">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-9 px-3 text-xs tracking-wider transition-all border ${
                          selectedSize === size
                            ? 'bg-[#111111] text-white border-[#111111]'
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
                <span className="text-xs uppercase tracking-wider text-[#777777]">Số lượng:</span>
                <div className="flex items-center border border-[#E8E8E8] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-[#555555] hover:text-black hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-[#555555] hover:text-black hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: ADD TO BAG, BUY NOW, Wishlist */}
            <div className="pt-4 border-t border-[#E8E8E8] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!quickViewProduct.inStock}
                  className={`flex-1 btn-luxury ${
                    !quickViewProduct.inStock ? 'opacity-50 cursor-not-allowed bg-neutral-300' : ''
                  }`}
                >
                  {quickViewProduct.inStock ? 'THÊM VÀO TÚI' : 'HẾT HÀNG'}
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 border border-[#E8E8E8] transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'hover:border-[#111111] text-[#111111]'
                  }`}
                  aria-label="Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {quickViewProduct.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full btn-luxury-outline text-xs"
                >
                  MUA NGAY
                </button>
              )}

              <div className="pt-2 text-center">
                <Link
                  to={`/product/${quickViewProduct.slug}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#111111] uppercase tracking-widest font-medium transition-colors"
                >
                  <span>Xem Chi Tiết Sản Phẩm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
