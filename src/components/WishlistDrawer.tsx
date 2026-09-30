import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { useProducts } from '../context/useProducts';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsWishlistOpen(false)}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#faf9f6] h-full shadow-2xl z-10 flex flex-col border-l border-neutral-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-300 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-neutral-900 font-medium">Danh Sách Yêu Thích</h3>
                <p className="text-xs text-neutral-500 tracking-wider uppercase mt-0.5">
                  {favoriteProducts.length} sản phẩm đã lưu
                </p>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {favoriteProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 border border-neutral-300 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h4 className="font-serif text-lg text-neutral-800">Chưa có sản phẩm nào</h4>
                  <p className="text-xs text-neutral-500 font-light mt-1 max-w-xs">
                    Hãy lưu lại những thiết kế mà bạn ưng ý bằng biểu tượng trái tim khi xem sản phẩm.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-6 btn-luxury text-xs"
                  >
                    KHÁM PHÁ CỬA HÀNG
                  </Link>
                </div>
              ) : (
                favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-20 aspect-[3/4] shrink-0 bg-neutral-100 overflow-hidden"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="font-medium text-xs text-neutral-900 hover:underline line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                            title="Xóa khỏi yêu thích"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-400 uppercase tracking-widest mt-0.5">
                          {product.categoryLabel}
                        </p>
                        <p className="text-xs font-semibold text-neutral-900 mt-1">
                          {formatPrice(product.salePrice ?? product.price)}
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                          className="w-full py-1.5 px-2 bg-neutral-900 text-white text-[11px] tracking-wider uppercase hover:bg-neutral-800 transition-colors disabled:bg-neutral-300"
                        >
                          {product.inStock ? '+ Thêm Vào Giỏ' : 'Hết Hàng'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {favoriteProducts.length > 0 && (
              <div className="p-6 border-t border-neutral-300 bg-white">
                <Link
                  to="/shop"
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-full btn-luxury-outline flex items-center justify-center gap-2 text-xs"
                >
                  XEM THÊM SẢN PHẨM KHÁC <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
