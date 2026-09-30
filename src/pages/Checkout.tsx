import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import { formatPrice } from '../data/products';
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, QrCode, ArrowLeft, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveOrder } from '../lib/customer-submissions';

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, couponCode, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [district, setDistrict] = useState('Quận Hoàn Kiếm');
  const [ward, setWard] = useState('Phường Tràng Tiền');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'card'>('cod');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Confirmation modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.email && !email) setEmail(user.email);
      if (user.name && !fullName) setFullName(user.name);
    }
  }, [user]);

  useEffect(() => {
    document.title = 'Thanh toán — HV CLOTHING';
    window.scrollTo(0, 0);
  }, []);

  if (cart.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="w-full bg-white py-24 min-h-[70vh] flex items-center justify-center text-center px-4">
        <div>
          <h2 className="font-serif text-3xl text-[#111111] mb-2 font-normal">Túi đồ của bạn đang trống</h2>
          <p className="text-xs text-[#777777] font-light mb-6">
            Vui lòng chọn sản phẩm vào túi trước khi tiến hành thanh toán.
          </p>
          <Link to="/shop" className="btn-luxury text-xs">
            QUAY LẠI CỬA HÀNG
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setOrderError('Túi đồ đang trống. Vui lòng chọn sản phẩm.');
      return;
    }
    if (!phone.trim()) {
      setOrderError('Vui lòng nhập số điện thoại nhận hàng.');
      return;
    }
    setIsSubmittingOrder(true);
    setOrderError('');
    try {
      const savedOrder = await saveOrder({
        email,
        fullName,
        phone,
        address,
        city,
        district,
        ward,
        paymentMethod,
        items: cart,
        subtotal,
        discount,
        couponCode,
        shippingFee,
        total,
      });
      setOrderCode(savedOrder.orderCode);
      clearCart();
      setIsSuccessModalOpen(true);
    } catch (submitError) {
      setOrderError(submitError instanceof Error ? submitError.message : 'Không thể lưu đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleFinish = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  return (
    <div className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 pb-4 border-b border-[#E8E8E8] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
              THANH TOÁN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
              Hoàn Tất Đơn Hàng
            </h1>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-[#111111] hover:text-[#777777] uppercase tracking-wider font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại túi đồ</span>
          </Link>
        </div>

        {/* 30. 2 COLUMNS DESKTOP */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Contact, Shipping, Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact & Shipping */}
            <div className="border border-[#E8E8E8] p-6 sm:p-8 bg-white">
              <h2 className="font-serif text-xl font-normal text-[#111111] mb-6 pb-3 border-b border-[#E8E8E8]">
                1. Thông Tin Nhận Hàng
              </h2>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                    Địa chỉ Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Số Điện Thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none cursor-pointer"
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="Quảng Ninh">Quảng Ninh</option>
                      <option value="Khánh Hòa">Khánh Hòa</option>
                      <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                      <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Quận / Huyện *
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Quận / Huyện"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                      Phường / Xã *
                    </label>
                    <input
                      type="text"
                      required
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="Phường / Xã"
                      className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#555555] uppercase tracking-wider font-medium mb-1.5">
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số 22 Phố Bà Triệu..."
                    className="w-full px-3.5 py-2.5 border border-[#E8E8E8] bg-[#F7F7F5] focus:outline-none focus:border-[#111111] font-light rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-[#E8E8E8] p-6 sm:p-8 bg-white">
              <h2 className="font-serif text-xl font-normal text-[#111111] mb-6 pb-3 border-b border-[#E8E8E8]">
                2. Phương Thức Thanh Toán
              </h2>

              <div className="space-y-3 text-xs">
                {/* COD */}
                <label
                  className={`p-4 border block cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#111111] bg-[#F7F7F5]'
                      : 'border-[#E8E8E8] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#111111]"
                      />
                      <div className="flex items-center gap-2 font-medium text-[#111111]">
                        <Banknote className="w-4 h-4 text-[#555555]" />
                        <span>THANH TOÁN KHI NHẬN HÀNG (COD)</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <p className="mt-2.5 pl-6 text-[#555555] font-light leading-relaxed">
                      Thanh toán tiền mặt cho nhân viên giao hàng khi nhận và kiểm tra gói hàng.
                    </p>
                  )}
                </label>

                {/* BANK TRANSFER */}
                <label
                  className={`p-4 border block cursor-pointer transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-[#111111] bg-[#F7F7F5]'
                      : 'border-[#E8E8E8] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="accent-[#111111]"
                      />
                      <div className="flex items-center gap-2 font-medium text-[#111111]">
                        <QrCode className="w-4 h-4 text-[#555555]" />
                        <span>CHUYỂN KHOẢN NGÂN HÀNG (VIETQR)</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'bank' && (
                    <div className="mt-3 pl-6 pt-2 border-t border-[#E8E8E8] text-[#555555] font-light space-y-1">
                      <p>• Ngân hàng: <strong>Techcombank</strong></p>
                      <p>• Số tài khoản: <strong>1903 6868 9999</strong></p>
                      <p>• Chủ tài khoản: <strong>HV CLOTHING VIETNAM</strong></p>
                      <p>• Nội dung CK: <strong>HV [Số Điện Thoại Của Bạn]</strong></p>
                    </div>
                  )}
                </label>

                {/* ONLINE PAYMENT */}
                <label
                  className={`p-4 border block cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#111111] bg-[#F7F7F5]'
                      : 'border-[#E8E8E8] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#111111]"
                      />
                      <div className="flex items-center gap-2 font-medium text-[#111111]">
                        <CreditCard className="w-4 h-4 text-[#555555]" />
                        <span>THANH TOÁN THẺ QUỐC TẾ (Visa, Mastercard, JCB)</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <p className="mt-2.5 pl-6 text-[#555555] font-light leading-relaxed">
                      Bảo mật mã hóa quốc tế SSL 256-bit chuẩn 3D-Secure qua cổng thanh toán bảo mật.
                    </p>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="border border-[#E8E8E8] p-6 sm:p-8 bg-white">
              <h2 className="font-serif text-xl font-normal text-[#111111] mb-5 pb-3 border-b border-[#E8E8E8]">
                Tóm Tắt Đơn Hàng ({cart.length})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1 mb-6">
                {cart.map((item, i) => (
                  <div key={i} className="py-3 flex gap-3 text-xs">
                    <div className="w-14 aspect-[3/4] bg-[#F7F7F5] shrink-0 overflow-hidden border border-[#E8E8E8]">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-[#111111] line-clamp-1">{item.product.name}</h4>
                        <p className="text-[#777777] text-[11px] font-light">
                          {item.selectedSize} / {item.selectedColor.name} • SL: {item.quantity}
                        </p>
                      </div>
                      <span className="font-serif font-medium text-[#111111]">
                        {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#E8E8E8] text-xs">
                <div className="flex justify-between text-[#555555]">
                  <span>Tạm tính</span>
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
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-medium">Miễn phí</strong> : formatPrice(shippingFee)}</span>
                </div>

                <div className="pt-4 border-t border-[#E8E8E8] flex justify-between items-baseline">
                  <span className="text-sm font-medium uppercase tracking-wider text-[#111111]">
                    Tổng cộng
                  </span>
                  <span className="font-serif text-2xl font-normal text-[#111111]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* PLACE ORDER Button */}
              <div className="mt-8">
                {orderError && <p role="alert" className="mb-3 text-xs text-[#A43131]">{orderError}</p>}
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-full btn-luxury flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmittingOrder ? 'ĐANG LƯU ĐƠN...' : 'ĐẶT HÀNG NGAY'}</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#777777] uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>Bao gồm hộp quà cao cấp chuẩn boutique HV CLOTHING</span>
              </div>
            </div>

          </div>

        </form>

      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white border border-[#E8E8E8] max-w-lg w-full p-8 text-center shadow-2xl"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
                ĐẶT HÀNG THÀNH CÔNG
              </span>

              <h2 className="font-serif text-3xl text-[#111111] font-normal mb-2">
                Cảm Ơn Quý Khách Đã Lựa Chọn HV CLOTHING
              </h2>

              <p className="text-xs text-[#555555] font-light max-w-sm mx-auto mb-6 leading-relaxed">
                Đơn hàng của bạn đã được ghi nhận vào hệ thống của xưởng may HV CLOTHING và sẽ sớm được đóng gói cẩn thận.
              </p>

              <div className="bg-[#F7F7F5] border border-[#E8E8E8] p-4 text-xs text-left mb-6 space-y-2 font-sans">
                <div className="flex justify-between border-b pb-2 border-[#E8E8E8]">
                  <span className="text-[#777777]">Mã đơn hàng:</span>
                  <strong className="text-black font-mono tracking-wider">{orderCode}</strong>
                </div>
                <div className="flex justify-between border-b pb-2 border-[#E8E8E8]">
                  <span className="text-[#777777]">Người nhận:</span>
                  <span className="text-[#111111] font-medium">{fullName || 'Quý khách'} ({phone})</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-[#E8E8E8]">
                  <span className="text-[#777777]">Địa chỉ nhận hàng:</span>
                  <span className="text-[#111111] text-right line-clamp-1">{address}, {ward}, {district}, {city}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#777777] font-medium">Tổng thanh toán:</span>
                  <strong className="text-black font-serif text-base">{formatPrice(total)}</strong>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="btn-luxury w-full text-xs"
              >
                QUAY VỀ TRANG CHỦ
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
