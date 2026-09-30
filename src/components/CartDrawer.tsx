import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { X, Trash2, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  const freeShippingThreshold = 1000000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:w-[420px] bg-white h-full shadow-2xl z-10 flex flex-col justify-between border-l border-[#E8E8E8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E8E8E8] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block">
                  TÚI MUA SẮM
                </span>
                <h3 className="font-serif text-xl font-normal text-[#111111]">
                  Túi Đồ ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F7F7F5] transition-colors"
                aria-label="Đóng túi đồ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Alert Bar */}
            <div className="px-6 py-3.5 bg-[#F7F7F5] border-b border-[#E8E8E8] text-xs">
              <div className="flex items-center justify-between mb-1.5">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> MIỄN PHÍ GIAO HÀNG TOÀN QUỐC!
                  </span>
                ) : (
                  <span className="text-[#555555] font-light text-[11px]">
                    Mua thêm <strong>{formatPrice(remainingForFreeShipping)}</strong> để được Miễn phí giao hàng
                  </span>
                )}
                <span className="font-medium text-[#111111] text-[11px]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-1 overflow-hidden">
                <div
                  className="bg-[#111111] h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 border border-[#E8E8E8] flex items-center justify-center mb-4 bg-[#F7F7F5]">
                    <ShoppingBag className="w-6 h-6 text-[#777777]" />
                  </div>
                  <h4 className="font-serif text-lg text-[#111111]">Túi đồ của bạn đang trống</h4>
                  <p className="text-xs text-[#777777] font-light mt-1 max-w-xs">
                    Khám phá bộ sưu tập mới nhất của HV CLOTHING để bổ sung những thiết kế vượt thời gian.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="mt-6 btn-luxury text-xs"
                  >
                    KHÁM PHÁ CỬA HÀNG
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                      className="flex gap-4 p-3 bg-white border border-[#E8E8E8] hover:border-neutral-400 transition-colors"
                    >
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="w-20 aspect-[3/4] bg-[#F7F7F5] shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-104 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.product.slug}`}
                              onClick={() => setIsCartDrawerOpen(false)}
                              className="font-medium text-xs text-[#111111] hover:underline line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name
                                )
                              }
                              className="text-[#777777] hover:text-rose-600 transition-colors p-0.5"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-[#777777] mt-0.5 font-light">
                            {item.selectedSize} / {item.selectedColor.name}
                          </p>

                          <p className="text-xs font-serif font-medium text-[#111111] mt-1">
                            {formatPrice(unitPrice)}
                          </p>
                        </div>

                        {/* Quantity Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#E8E8E8] bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-0.5 text-xs text-[#555555] hover:text-black hover:bg-neutral-100"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-[11px] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-0.5 text-xs text-[#555555] hover:text-black hover:bg-neutral-100"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-serif font-semibold text-[#111111]">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E8E8E8] bg-white space-y-3">
                <div className="flex items-baseline justify-between text-xs pb-1">
                  <span className="uppercase tracking-wider text-[#777777]">Tạm Tính</span>
                  <span className="font-serif text-lg font-bold text-[#111111]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleViewCart}
                    className="flex-1 py-3 text-xs uppercase tracking-[0.16em] font-medium border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                  >
                    XEM GIỎ HÀNG
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-3 text-xs uppercase tracking-[0.16em] font-medium bg-[#111111] text-white hover:bg-black transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>THANH TOÁN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
