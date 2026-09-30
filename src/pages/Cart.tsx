import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { Trash2, ArrowRight, ShoppingBag, Tag, Check, ArrowLeft } from 'lucide-react';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    shippingFee,
    total,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Giỏ hàng — HV CLOTHING';
  }, []);

  const freeShippingThreshold = 1000000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) setInputCoupon('');
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white py-24 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-18 h-18 border border-[#E8E8E8] mx-auto flex items-center justify-center mb-6 bg-[#F7F7F5]">
            <ShoppingBag className="w-8 h-8 text-[#777777] stroke-[1.2]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-2">
            HV CLOTHING ATELIER
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] mb-3 font-normal">
            TÚI ĐỒ ĐANG TRỐNG
          </h2>
          <p className="text-xs text-[#777777] font-light leading-relaxed mb-8 font-sans">
            Túi đồ của bạn hiện chưa có sản phẩm nào. Hãy khám phá các thiết kế mới nhất của chúng tôi để bổ sung cho tủ đồ của bạn.
          </p>
          <Link to="/shop" className="btn-luxury inline-flex items-center gap-2">
            <span>TIẾP TỤC MUA SẮM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#E8E8E8] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
              TỔNG QUAN ĐƠN HÀNG
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
              TÚI ĐỒ CỦA BẠN
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#777777] hover:text-[#111111] underline uppercase tracking-wider"
          >
            Xóa toàn bộ túi đồ
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="mb-8 p-4 bg-[#F7F7F5] border border-[#E8E8E8]">
          <div className="flex items-center justify-between text-xs mb-2">
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Đơn hàng của bạn được MIỄN PHÍ GIAO HÀNG TOÀN QUỐC!
              </span>
            ) : (
              <span className="text-[#555555] font-light">
                Mua thêm <strong className="font-medium text-[#111111]">{formatPrice(remainingForFreeShipping)}</strong> để được <strong className="text-[#111111] font-medium">Miễn phí giao hàng</strong>
              </span>
            )}
            <span className="font-medium text-[#111111]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-1 overflow-hidden">
            <div
              className="bg-[#111111] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Column: Product Table + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Product Table (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E8E8E8] p-4 sm:p-6">
            
            {/* Desktop Table Header */}
            <div className="hidden sm:grid grid-cols-12 pb-4 border-b border-[#E8E8E8] text-[11px] uppercase tracking-[0.16em] text-[#777777] font-medium">
              <span className="col-span-6">Sản phẩm</span>
              <span className="col-span-2 text-center">Đơn giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-right">Tạm tính</span>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-[#E8E8E8]">
              {cart.map((item, idx) => {
                const unitPrice = item.product.salePrice ?? item.product.price;
                const rowTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                    className="py-6 flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-4"
                  >
                    {/* Image & Title (6 cols) */}
                    <div className="sm:col-span-6 flex gap-4 w-full">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="w-20 sm:w-24 aspect-[3/4] bg-[#F7F7F5] shrink-0 overflow-hidden border border-[#E8E8E8]"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-104 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex flex-col justify-between py-0.5 flex-1">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#777777] block mb-0.5">
                            {item.product.categoryLabel}
                          </span>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-medium text-xs sm:text-sm text-[#111111] hover:underline line-clamp-1"
                          >
                            {item.product.name}
                          </Link>

                          <div className="mt-1 flex items-center gap-3 text-xs text-[#555555] font-light">
                            <span>Kích cỡ: <strong>{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              Màu sắc:
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-300"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <strong>{item.selectedColor.name}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.name)}
                          className="mt-3 text-[#777777] hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px] font-light"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>

                    {/* Price (2 cols) */}
                    <div className="sm:col-span-2 text-left sm:text-center text-xs font-serif font-medium text-[#111111]">
                      <span className="sm:hidden text-[#777777] font-sans mr-2">Đơn giá:</span>
                      {formatPrice(unitPrice)}
                    </div>

                    {/* Quantity Control (2 cols) */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center w-full sm:w-auto">
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
                          className="px-2.5 py-1 text-[#555555] hover:text-black hover:bg-neutral-100 text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.name,
                              item.quantity + 1
                            )
                          }
                          className="px-2.5 py-1 text-[#555555] hover:text-black hover:bg-neutral-100 text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal (2 cols) */}
                    <div className="sm:col-span-2 text-left sm:text-right text-xs sm:text-sm font-serif font-semibold text-[#111111]">
                      <span className="sm:hidden text-[#777777] font-sans mr-2">Tạm tính:</span>
                      {formatPrice(rowTotal)}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Back link */}
            <div className="pt-6 border-t border-[#E8E8E8]">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs text-[#111111] hover:text-[#777777] tracking-[0.14em] uppercase font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tiếp tục mua sắm</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Summary Box */}
            <div className="bg-white border border-[#E8E8E8] p-6 sm:p-7">
              <h3 className="font-serif text-xl font-normal text-[#111111] mb-5 pb-3 border-b border-[#E8E8E8]">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-[#555555]">
                  <span>Tạm tính ({cart.length} món)</span>
                  <span className="font-medium text-[#111111]">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Giảm giá ({couponCode})</span>
                    <span className="font-medium">- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#555555]">
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700 font-medium">Miễn phí</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E8E8E8] flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-wider font-medium text-[#111111]">
                    Tổng cộng
                  </span>
                  <span className="font-serif text-2xl font-normal text-[#111111]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-luxury flex items-center justify-center gap-2"
                >
                  <span>TIẾN HÀNH THANH TOÁN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="bg-white border border-[#E8E8E8] p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#111111] mb-3">
                <Tag className="w-3.5 h-3.5" />
                <span>MÃ ƯU ĐÃI</span>
              </div>

              {couponCode ? (
                <div className="p-3 bg-[#F7F7F5] border border-[#E8E8E8] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-black tracking-wider">{couponCode}</span>
                    <p className="text-[11px] text-emerald-700">Đã áp dụng giảm giá 10%</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 hover:underline">
                    Gỡ bỏ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Nhập mã (HV10)"
                    className="flex-1 px-3 py-2 border border-[#E8E8E8] text-xs font-light focus:outline-none focus:border-[#111111] uppercase placeholder:normal-case rounded-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-wider font-medium shrink-0 rounded-none"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
