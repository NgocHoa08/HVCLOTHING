import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  LoaderCircle,
  LogOut,
  Package,
  Search,
  Shield,
  ShoppingBag,
  Truck,
  User as UserIcon,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../context/useAuth';
import { firebaseConfigured, firebaseDb } from '../lib/firebase';
import { formatPrice } from '../data/products';
import { getLocalOrders, type StoredOrder } from '../lib/customer-submissions';
import {
  OrderProgressTimeline,
  OrderStatusBadge,
  type OrderStatus,
} from '../components/OrderTracker';

interface UserOrder extends StoredOrder {
  id: string;
}

const formatOrderDate = (dateVal?: any): string => {
  if (!dateVal) return 'Đang cập nhật';
  try {
    if (typeof dateVal?.toDate === 'function') {
      return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(
        dateVal.toDate(),
      );
    }
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
    }
  } catch {}
  return 'Đang cập nhật';
};

export const Account: React.FC = () => {
  const { user, loading, login, register, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab states for logged in user: 'orders' | 'tracking' | 'profile'
  const initialTab = (searchParams.get('tab') as 'orders' | 'tracking' | 'profile') || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'profile'>(initialTab);

  // Guest mode: 'login' | 'register' | 'tracking'
  const initialGuestMode = searchParams.get('tab') === 'tracking'
    ? 'tracking'
    : searchParams.get('mode') === 'register'
    ? 'register'
    : 'login';
  const [guestMode, setGuestMode] = useState<'login' | 'register' | 'tracking'>(initialGuestMode);

  // Login / Register states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nextPath = searchParams.get('next');

  // Orders states for user
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Tracking query state
  const initialSearchCode = searchParams.get('code') || '';
  const [trackingCode, setTrackingCode] = useState(initialSearchCode);
  const [trackedOrder, setTrackedOrder] = useState<UserOrder | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // 1. Real-time Order synchronization for logged in user
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);

    // Initial load from local backup
    const local = getLocalOrders() as UserOrder[];
    const userLocal = local.filter(
      (o) => (user.id && o.userId === user.id) || (user.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase()),
    );
    setOrders(userLocal);

    if (!firebaseDb) {
      setOrdersLoading(false);
      return;
    }

    // Real-time Firestore listener for user's orders
    let q;
    try {
      q = query(collection(firebaseDb, 'orders'), where('userId', '==', user.id));
    } catch {
      q = null;
    }

    if (!q) {
      setOrdersLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudOrders = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as UserOrder[];

        // Merge cloud with local orders
        const merged = [...cloudOrders];
        for (const loc of userLocal) {
          if (!merged.some((m) => m.orderCode === loc.orderCode)) {
            merged.push(loc);
          }
        }

        // Sort newest first
        merged.sort((a, b) => {
          const tA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt).getTime() || 0;
          const tB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt).getTime() || 0;
          return tB - tA;
        });

        setOrders(merged);
        setOrdersLoading(false);
      },
      (err) => {
        console.warn('Lỗi lắng nghe đơn hàng Firestore (đang dùng dữ liệu máy):', err);
        setOrders(userLocal);
        setOrdersLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  // 2. Direct lookup by code if provided in URL parameter
  useEffect(() => {
    if (initialSearchCode.trim()) {
      handleLookupOrder(initialSearchCode.trim());
    }
  }, [initialSearchCode]);

  // Handle single order lookup (by order code or phone)
  const handleLookupOrder = (codeToSearch: string) => {
    const queryTerm = codeToSearch.trim().toUpperCase();
    if (!queryTerm) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackedOrder(null);

    // 1. Check local orders first
    const allLocal = getLocalOrders() as UserOrder[];
    const foundLocal = allLocal.find(
      (o) =>
        o.orderCode.toUpperCase() === queryTerm ||
        (o.customer?.phone && o.customer.phone.replace(/\s+/g, '') === queryTerm.replace(/\s+/g, '')),
    );

    if (foundLocal) {
      setTrackedOrder(foundLocal);
    }

    // 2. Query Firestore if available
    if (firebaseDb) {
      const q = query(collection(firebaseDb, 'orders'), where('orderCode', '==', queryTerm));
      onSnapshot(
        q,
        (snapshot) => {
          setTrackingLoading(false);
          if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            setTrackedOrder({ id: docSnap.id, ...docSnap.data() } as UserOrder);
            setTrackingError('');
          } else if (!foundLocal) {
            setTrackingError(`Không tìm thấy đơn hàng với mã "${queryTerm}". Vui lòng kiểm tra lại.`);
          }
        },
        (err) => {
          setTrackingLoading(false);
          if (!foundLocal) {
            setTrackingError(`Không thể tra cứu đơn hàng: ${err.message}`);
          }
        },
      );
    } else {
      setTrackingLoading(false);
      if (!foundLocal) {
        setTrackingError(`Không tìm thấy đơn hàng với mã "${queryTerm}".`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F7F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#263C36] border-t-transparent" />
          <p className="text-xs text-[#777]">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: LOGGED IN USER (Profile, Real-time Orders, Tracker)
  // =========================================================================
  if (user) {
    return (
      <main className="min-h-[80vh] bg-[#F7F7F5] px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Top User Greeting Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E0DB] bg-white p-6 shadow-xs">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#777]">HV CLOTHING MEMBER</p>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl text-[#171A18]">
                {user.name ? `Xin chào, ${user.name}` : user.email}
              </h1>
              <p className="mt-1 text-xs text-[#777]">
                Theo dõi tình trạng xử lý đơn hàng và cập nhật trực tiếp từ xưởng may.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-[#263C36] text-white' : 'bg-[#EAEAEA] text-[#555]'
                }`}
              >
                {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 border border-[#D5D5CF] bg-white px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <nav className="mb-6 flex border-b border-[#DADAD4] overflow-x-auto bg-white">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wider uppercase font-medium border-b-2 transition-colors shrink-0 ${
                activeTab === 'orders'
                  ? 'border-[#263C36] text-[#263C36] bg-[#FBFBFA]'
                  : 'border-transparent text-[#777] hover:text-[#111]'
              }`}
            >
              <ShoppingBag size={15} />
              <span>Đơn hàng của tôi {orders.length > 0 && `(${orders.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wider uppercase font-medium border-b-2 transition-colors shrink-0 ${
                activeTab === 'tracking'
                  ? 'border-[#263C36] text-[#263C36] bg-[#FBFBFA]'
                  : 'border-transparent text-[#777] hover:text-[#111]'
              }`}
            >
              <Search size={15} />
              <span>Tra cứu mã đơn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wider uppercase font-medium border-b-2 transition-colors shrink-0 ${
                activeTab === 'profile'
                  ? 'border-[#263C36] text-[#263C36] bg-[#FBFBFA]'
                  : 'border-transparent text-[#777] hover:text-[#111]'
              }`}
            >
              <UserIcon size={15} />
              <span>Hồ sơ tài khoản</span>
            </button>
          </nav>

          {/* TAB 1: USER ORDERS LIST WITH REAL-TIME TIMELINE */}
          {activeTab === 'orders' && (
            <section className="space-y-4">
              {ordersLoading && (
                <div className="flex items-center justify-center p-12 bg-white border border-[#E2E0DB]">
                  <LoaderCircle className="w-5 h-5 animate-spin text-[#263C36] mr-2" />
                  <span className="text-xs text-[#777]">Đang tải danh sách đơn hàng...</span>
                </div>
              )}

              {!ordersLoading && orders.length === 0 && (
                <div className="p-12 text-center bg-white border border-[#E2E0DB]">
                  <ShoppingBag className="w-12 h-12 text-[#CCC] mx-auto mb-3 stroke-[1.2]" />
                  <h3 className="font-serif text-xl text-[#111] mb-1">Bạn chưa có đơn hàng nào</h3>
                  <p className="text-xs text-[#777] font-light max-w-sm mx-auto mb-5">
                    Khám phá bộ sưu tập mới nhất của HV CLOTHING để nâng tầm phong cách của bạn.
                  </p>
                  <Link to="/shop" className="btn-luxury text-xs inline-block">
                    KHÁM PHÁ CỬA HÀNG
                  </Link>
                </div>
              )}

              {!ordersLoading &&
                orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const currentStatus = (order.status || 'new') as OrderStatus;

                  return (
                    <article
                      key={order.id}
                      className="border border-[#E2E0DB] bg-white transition-all overflow-hidden"
                    >
                      {/* Order Summary Header Bar */}
                      <div
                        onClick={() => setExpandedOrderId((cur) => (cur === order.id ? null : order.id))}
                        className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#263C36]/5 text-[#263C36] flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-[#111]">
                                {order.orderCode}
                              </span>
                              <span className="text-[10px] text-[#999]">•</span>
                              <span className="text-xs text-[#777]">
                                {formatOrderDate(order.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-[#555] mt-0.5">
                              {order.items?.length || 0} sản phẩm · Tổng tiền:{' '}
                              <strong className="text-[#111] font-serif font-medium">
                                {formatPrice(order.total || 0)}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <OrderStatusBadge status={currentStatus} />
                          <button
                            type="button"
                            className="text-xs font-medium text-[#263C36] inline-flex items-center gap-1 hover:underline"
                          >
                            <span>{isExpanded ? 'Thu gọn' : 'Xem tiến độ'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Order Details & Real-Time Progress Timeline */}
                      {isExpanded && (
                        <div className="border-t border-[#ECEBE6] p-6 bg-[#FAFAF8] space-y-6 animate-fadeIn">
                          {/* 1. Real-Time Status Timeline */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#777]">
                                TIẾN ĐỘ ĐƠN HÀNG (CẬP NHẬT TRỰC TIẾP)
                              </span>
                              <span className="text-[11px] text-[#263C36] font-medium flex items-center gap-1">
                                <Clock size={12} />
                                Đang tự động đồng bộ thời gian thực
                              </span>
                            </div>
                            <OrderProgressTimeline status={currentStatus} />
                          </div>

                          {/* 2. Recipient & Shipping Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans border-t border-[#ECEBE6] pt-4">
                            <div className="p-4 bg-white border border-[#E8E8E8]">
                              <h4 className="font-semibold text-[#111] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Truck size={14} /> Thông tin giao nhận
                              </h4>
                              <p className="text-[#555]">
                                <strong>Người nhận:</strong> {order.customer?.fullName} ({order.customer?.phone})
                              </p>
                              <p className="text-[#555] mt-1">
                                <strong>Địa chỉ:</strong> {order.shipping?.address}, {order.shipping?.ward},{' '}
                                {order.shipping?.district}, {order.shipping?.city}
                              </p>
                            </div>

                            <div className="p-4 bg-white border border-[#E8E8E8]">
                              <h4 className="font-semibold text-[#111] uppercase tracking-wider mb-2">
                                Thanh toán & Chi phí
                              </h4>
                              <div className="space-y-1 text-[#555]">
                                <div className="flex justify-between">
                                  <span>Hình thức:</span>
                                  <span className="font-medium text-[#111] uppercase">
                                    {order.paymentMethod === 'cod'
                                      ? 'Thanh toán khi nhận hàng (COD)'
                                      : order.paymentMethod === 'bank'
                                      ? 'Chuyển khoản ngân hàng'
                                      : 'Thẻ quốc tế'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tạm tính:</span>
                                  <span>{formatPrice(order.subtotal || 0)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-emerald-700">
                                    <span>Giảm giá ({order.couponCode}):</span>
                                    <span>- {formatPrice(order.discount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Phí vận chuyển:</span>
                                  <span>{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
                                </div>
                                <div className="flex justify-between border-t border-[#F0F0EE] pt-1.5 font-semibold text-[#111]">
                                  <span>Tổng thanh toán:</span>
                                  <span className="font-serif text-sm">{formatPrice(order.total || 0)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Items list */}
                          <div className="border-t border-[#ECEBE6] pt-4">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#777] mb-3">
                              SẢN PHẨM TRONG ĐƠN ({order.items?.length || 0})
                            </h4>
                            <div className="divide-y divide-[#EAEAEA] bg-white border border-[#E8E8E8]">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="p-3.5 flex items-center justify-between text-xs gap-3">
                                  <div className="flex items-center gap-3">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-14 object-cover border border-[#E8E8E8] shrink-0"
                                      />
                                    ) : (
                                      <div className="w-12 h-14 bg-[#F5F5F3] flex items-center justify-center border border-[#E8E8E8] text-[#888] shrink-0">
                                        <Package size={16} />
                                      </div>
                                    )}
                                    <div>
                                      <h5 className="font-medium text-[#111]">{item.name}</h5>
                                      <p className="text-[11px] text-[#777] mt-0.5">
                                        Kích cỡ: <strong>{item.size}</strong> · Màu: <strong>{item.color}</strong> · SL:{' '}
                                        {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-serif font-medium text-[#111]">
                                    {formatPrice(item.lineTotal || item.unitPrice * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
            </section>
          )}

          {/* TAB 2: ORDER LOOKUP / TRACKER */}
          {activeTab === 'tracking' && (
            <section className="border border-[#E2E0DB] bg-white p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-2xl text-[#111]">Tra cứu đơn hàng trực tiếp</h2>
                <p className="text-xs text-[#777] mt-1 font-light">
                  Nhập mã đơn hàng (ví dụ: <strong className="font-mono text-[#111]">HV-260930-XXXX</strong>) hoặc số điện thoại người nhận để xem tiến trình vận chuyển theo thời gian thực.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookupOrder(trackingCode);
                }}
                className="flex gap-2 max-w-xl"
              >
                <input
                  type="text"
                  required
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Nhập mã đơn hàng (HV-...)"
                  className="flex-1 px-4 py-2.5 border border-[#D5D5CF] text-xs font-mono uppercase focus:outline-none focus:border-[#263C36]"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="btn-luxury px-6 text-xs inline-flex items-center gap-2"
                >
                  {trackingLoading ? <LoaderCircle size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>TRA CỨU</span>
                </button>
              </form>

              {trackingError && (
                <p role="alert" className="text-xs text-[#A43131] bg-rose-50 border border-rose-200 p-3">
                  {trackingError}
                </p>
              )}

              {trackedOrder && (
                <div className="border border-[#E2E0DB] p-6 bg-[#FAFAF8] space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEBE6] pb-4">
                    <div>
                      <span className="text-[10px] text-[#777] uppercase tracking-wider block">Mã đơn hàng</span>
                      <h3 className="font-mono text-xl font-bold text-[#111]">{trackedOrder.orderCode}</h3>
                      <p className="text-xs text-[#777] mt-0.5">Đặt ngày: {formatOrderDate(trackedOrder.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={trackedOrder.status || 'new'} />
                  </div>

                  <OrderProgressTimeline status={trackedOrder.status || 'new'} />

                  <div className="text-xs text-[#444] bg-white p-4 border border-[#E8E8E8]">
                    <p>
                      <strong>Người nhận:</strong> {trackedOrder.customer?.fullName} · {trackedOrder.customer?.phone}
                    </p>
                    <p className="mt-1">
                      <strong>Địa chỉ giao hàng:</strong> {trackedOrder.shipping?.address}, {trackedOrder.shipping?.ward},{' '}
                      {trackedOrder.shipping?.district}, {trackedOrder.shipping?.city}
                    </p>
                    <p className="mt-1">
                      <strong>Tổng thanh toán:</strong> {formatPrice(trackedOrder.total || 0)}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* TAB 3: USER PROFILE */}
          {activeTab === 'profile' && (
            <section className="border border-[#E2E0DB] bg-white p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl text-[#111]">Thông tin tài khoản</h2>
              <div className="space-y-3 text-xs text-[#333]">
                <div className="flex justify-between border-b border-[#F0F0EE] py-3">
                  <span className="text-[#777]">Địa chỉ Email:</span>
                  <span className="font-medium text-[#111]">{user.email}</span>
                </div>
                {user.name && (
                  <div className="flex justify-between border-b border-[#F0F0EE] py-3">
                    <span className="text-[#777]">Họ và tên:</span>
                    <span className="font-medium text-[#111]">{user.name}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#F0F0EE] py-3">
                  <span className="text-[#777]">Mã định danh (UID):</span>
                  <span className="font-mono text-[11px] text-[#666]">{user.id}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#263C36] px-5 text-xs font-medium tracking-[0.14em] text-white hover:bg-[#192A25]"
                  >
                    <Shield size={15} /> QUẢN TRỊ ADMIN
                  </Link>
                )}
                <Link
                  to="/shop"
                  className="inline-flex min-h-11 items-center justify-center border border-[#D5D5CF] bg-white px-5 text-xs font-medium tracking-[0.14em] text-[#333] hover:bg-[#F7F7F5]"
                >
                  MUA SẮM NGAY
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  // =========================================================================
  // VIEW B: GUEST MODE (Login, Register, and Fast Order Lookup)
  // =========================================================================
  const handleSubmitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedInUser =
        guestMode === 'register'
          ? await register(name, email, password)
          : await login(email, password);
      const safeDestination =
        nextPath?.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : signedInUser.role === 'admin'
          ? '/admin'
          : '/';
      navigate(safeDestination, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể thực hiện đăng nhập.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[78vh] bg-[#F7F7F5] px-5 py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#E2E0DB] bg-white md:grid-cols-[0.9fr_1.1fr]">
        {/* Left Side Brand Info */}
        <div className="hidden min-h-[560px] bg-[#263C36] p-12 text-white md:flex md:flex-col md:justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/logo.png" alt="HV CLOTHING" className="h-10 w-auto brightness-0 invert" />
            <span className="font-serif text-2xl tracking-[0.18em]">HV CLOTHING</span>
          </Link>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-[#C8D2C8]">HV CLOTHING STUDIO</p>
            <h1 className="max-w-sm font-serif text-4xl leading-tight">Phong cách của bạn, bắt đầu từ đây.</h1>
          </div>
          <p className="text-xs text-[#D1D8D1]">Thiết kế có chủ đích. Sống cùng thời gian.</p>
        </div>

        {/* Right Side: Form or Tracker */}
        <div className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-12">
          <Link to="/" className="mb-8 inline-flex w-fit items-center gap-2 text-xs text-[#777] hover:text-black">
            <ArrowLeft size={14} aria-hidden="true" /> Trở về cửa hàng
          </Link>

          {/* Mode Switcher Buttons */}
          <div className="mb-8 flex gap-2 border-b border-[#ECEBE6] pb-3 text-xs uppercase tracking-wider font-medium">
            <button
              type="button"
              onClick={() => {
                setError('');
                setGuestMode('login');
              }}
              className={`pb-1 transition-colors ${
                guestMode === 'login' ? 'border-b-2 border-[#263C36] text-[#263C36] font-semibold' : 'text-[#777]'
              }`}
            >
              Đăng nhập
            </button>
            <span className="text-[#CCC]">·</span>
            <button
              type="button"
              onClick={() => {
                setError('');
                setGuestMode('register');
              }}
              className={`pb-1 transition-colors ${
                guestMode === 'register' ? 'border-b-2 border-[#263C36] text-[#263C36] font-semibold' : 'text-[#777]'
              }`}
            >
              Đăng ký
            </button>
            <span className="text-[#CCC]">·</span>
            <button
              type="button"
              onClick={() => {
                setError('');
                setGuestMode('tracking');
              }}
              className={`pb-1 transition-colors ${
                guestMode === 'tracking' ? 'border-b-2 border-[#263C36] text-[#263C36] font-semibold' : 'text-[#777]'
              }`}
            >
              Tra cứu đơn hàng
            </button>
          </div>

          {/* MODE: TRA CỨU ĐƠN HÀNG DÀNH CHO KHÁCH */}
          {guestMode === 'tracking' ? (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl text-[#171A18]">Tra cứu tiến độ đơn hàng</h2>
              <p className="text-xs text-[#777] font-light leading-relaxed">
                Nhập mã đơn hàng bạn đã nhận khi đặt hàng để theo dõi trạng thái xử lý trực tiếp.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookupOrder(trackingCode);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs text-[#555] mb-1">Mã đơn hàng</label>
                  <input
                    type="text"
                    required
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Ví dụ: HV-260930-XXXX"
                    className="w-full border-b border-[#D8D6D0] bg-transparent py-2.5 text-sm font-mono uppercase outline-none focus:border-[#263C36]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="w-full btn-luxury text-xs flex items-center justify-center gap-2"
                >
                  {trackingLoading ? <LoaderCircle size={15} className="animate-spin" /> : <Search size={15} />}
                  <span>TRA CỨU TRẠNG THÁI</span>
                </button>
              </form>

              {trackingError && (
                <p role="alert" className="text-xs text-[#A43131] bg-rose-50 border border-rose-200 p-3">
                  {trackingError}
                </p>
              )}

              {trackedOrder && (
                <div className="mt-4 p-4 border border-[#E8E8E8] bg-[#F9F9F7] space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-[#ECEBE6]">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#111]">{trackedOrder.orderCode}</span>
                      <p className="text-[11px] text-[#777]">{formatOrderDate(trackedOrder.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={trackedOrder.status || 'new'} />
                  </div>
                  <OrderProgressTimeline status={trackedOrder.status || 'new'} />
                </div>
              )}
            </div>
          ) : (
            /* MODE: ĐĂNG NHẬP / ĐĂNG KÝ */
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#777]">
                {guestMode === 'register' ? 'THÀNH VIÊN HV CLOTHING' : 'CHÀO MỪNG TRỞ LẠI'}
              </p>
              <h2 className="mb-8 font-serif text-3xl text-[#171A18]">
                {guestMode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'}
              </h2>

              {!firebaseConfigured && (
                <p role="alert" className="mb-5 border border-[#E6D5A8] bg-[#FFF9E9] px-3 py-2 text-xs text-[#715B20]">
                  Firebase chưa được cấu hình. Hãy điền thông tin trong file .env rồi khởi động lại ứng dụng.
                </p>
              )}

              <form onSubmit={handleSubmitAuth} className="space-y-5">
                {guestMode === 'register' && (
                  <div>
                    <label htmlFor="account-name" className="mb-1.5 block text-xs text-[#555]">
                      Họ và tên
                    </label>
                    <input
                      id="account-name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={120}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="account-email" className="mb-1.5 block text-xs text-[#555]">
                    Email
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]"
                  />
                </div>
                <div>
                  <label htmlFor="account-password" className="mb-1.5 block text-xs text-[#555]">
                    Mật khẩu
                  </label>
                  <input
                    id="account-password"
                    type="password"
                    autoComplete={guestMode === 'register' ? 'new-password' : 'current-password'}
                    required
                    minLength={guestMode === 'register' ? 10 : undefined}
                    maxLength={128}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]"
                  />
                  {guestMode === 'register' && <p className="mt-2 text-[11px] text-[#777]">Tối thiểu 10 ký tự.</p>}
                </div>

                {error && <p role="alert" className="text-xs text-[#A43131]">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#263C36] px-5 text-xs font-medium tracking-[0.14em] text-white transition-colors hover:bg-[#192A25] disabled:opacity-60"
                >
                  {submitting && <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />}
                  {guestMode === 'register' ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};