import { addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from './firebase';
import type { CartItem } from '../types/product';

export const LOCAL_ORDERS_KEY = 'hv_local_orders';

export interface StoredOrder {
  id: string;
  orderCode: string;
  customer: {
    email: string;
    fullName: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    image: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'cod' | 'bank' | 'card';
  status: 'new' | 'confirmed' | 'packing' | 'shipped' | 'completed' | 'cancelled';
  userId: string | null;
  createdAt: any;
  syncedToCloud?: boolean;
  cloudError?: string;
}

export interface PlaceOrderInput {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  paymentMethod: 'cod' | 'bank' | 'card';
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingFee: number;
  total: number;
}

export const generateOrderCode = (): string => {
  const now = new Date();
  const dateStr = now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HV-${dateStr}-${randomStr}`;
};

export const getLocalOrders = (): StoredOrder[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Tự động làm sạch các chuỗi Base64 ảnh cũ nếu có trong local storage
    return parsed.map((order) => {
      if (Array.isArray(order.items)) {
        order.items = order.items.map((it: any) => ({
          ...it,
          image: typeof it.image === 'string' && (it.image.startsWith('data:image') || it.image.length > 500) ? '' : (it.image || ''),
        }));
      }
      return order;
    });
  } catch {
    return [];
  }
};

export const saveLocalOrder = (order: StoredOrder) => {
  try {
    const current = getLocalOrders();
    const existingIndex = current.findIndex((o) => o.orderCode === order.orderCode);
    if (existingIndex > -1) {
      current[existingIndex] = order;
    } else {
      current.unshift(order);
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(current.slice(0, 100)));
  } catch (err) {
    console.error('Không thể lưu đơn hàng vào bộ nhớ máy:', err);
  }
};

export const saveOrder = async (input: PlaceOrderInput): Promise<{ id: string; orderCode: string; isLocalOnly?: boolean }> => {
  const orderCode = generateOrderCode();
  const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Chuẩn hóa dữ liệu sản phẩm, tuyệt đối không lưu chuỗi Base64 ảnh nặng vào document đơn hàng
  const items = (input.items || []).map((item) => {
    const unitPrice = Number(item.product?.salePrice ?? item.product?.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const colorName =
      typeof item.selectedColor === 'object' && item.selectedColor?.name
        ? item.selectedColor.name
        : typeof item.selectedColor === 'string'
        ? item.selectedColor
        : 'Mặc định';

    let cleanImage = '';
    if (Array.isArray(item.product?.images) && item.product.images.length > 0) {
      const rawImg = String(item.product.images[0] || '');
      // Chỉ lưu URL thực tế (http, https hoặc đường dẫn tĩnh /). Không bao giờ lưu Base64 hàng trăm KB
      if (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/') || (rawImg.length < 500 && !rawImg.startsWith('data:'))) {
        cleanImage = rawImg;
      }
    }

    return {
      productId: String(item.product?.id || ''),
      name: String(item.product?.name || 'Sản phẩm HV CLOTHING'),
      slug: String(item.product?.slug || item.product?.id || ''),
      image: cleanImage,
      size: String(item.selectedSize || 'Freesize'),
      color: colorName,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  const baseOrderData: StoredOrder = {
    id: localId,
    orderCode,
    customer: {
      email: (input.email || '').trim().toLowerCase(),
      fullName: (input.fullName || '').trim(),
      phone: (input.phone || '').trim(),
    },
    shipping: {
      address: (input.address || '').trim(),
      city: input.city || 'Hà Nội',
      district: (input.district || '').trim(),
      ward: (input.ward || '').trim(),
    },
    items,
    subtotal: Number(input.subtotal) || 0,
    discount: Number(input.discount) || 0,
    couponCode: input.couponCode || '',
    shippingFee: Number(input.shippingFee) || 0,
    total: Number(input.total) || 0,
    paymentMethod: input.paymentMethod || 'cod',
    status: 'new',
    userId: firebaseAuth?.currentUser?.uid ?? null,
    createdAt: new Date().toISOString(),
    syncedToCloud: false,
  };

  // Lưu bản sao dự phòng vào Local Storage ngay lập tức để không bao giờ mất đơn hàng của khách
  saveLocalOrder(baseOrderData);

  // Thử gửi đơn hàng lên Firestore Cloud
  if (firebaseDb) {
    try {
      const firestorePayload = {
        ...baseOrderData,
        createdAt: serverTimestamp(),
      };
      delete (firestorePayload as any).id;
      delete firestorePayload.syncedToCloud;
      delete firestorePayload.cloudError;

      const savedDoc = await addDoc(collection(firebaseDb, 'orders'), firestorePayload);

      // Cập nhật trạng thái đã lưu Cloud thành công
      baseOrderData.id = savedDoc.id;
      baseOrderData.syncedToCloud = true;
      saveLocalOrder(baseOrderData);

      return { id: savedDoc.id, orderCode, isLocalOnly: false };
    } catch (cloudError: any) {
      console.warn('Không thể gửi đơn lên Cloud Firestore (sẽ lưu tạm trên máy):', cloudError);
      baseOrderData.cloudError = cloudError?.message || 'Chưa phân quyền Firestore Rules';
      saveLocalOrder(baseOrderData);
      // Vẫn trả về thành công với orderCode để khách hàng không bị chặn và nhận được mã đơn!
      return { id: localId, orderCode, isLocalOnly: true };
    }
  }

  return { id: localId, orderCode, isLocalOnly: true };
};

export const syncLocalOrdersToFirestore = async (): Promise<{ syncedCount: number; errors: string[] }> => {
  if (!firebaseDb) return { syncedCount: 0, errors: ['Chưa kết nối Firebase'] };
  const localOrders = getLocalOrders();
  const unsynced = localOrders.filter((o) => !o.syncedToCloud);
  let syncedCount = 0;
  const errors: string[] = [];

  for (const order of unsynced) {
    try {
      const cleanedItems = (order.items || []).map((it) => ({
        ...it,
        image: typeof it.image === 'string' && (it.image.startsWith('data:image') || it.image.length > 500) ? '' : (it.image || ''),
      }));

      const payload = {
        ...order,
        items: cleanedItems,
        createdAt: serverTimestamp(),
      };
      delete (payload as any).syncedToCloud;
      delete (payload as any).cloudError;

      if (order.id.startsWith('local_')) {
        const savedDoc = await addDoc(collection(firebaseDb, 'orders'), payload);
        order.id = savedDoc.id;
      } else {
        await setDoc(doc(firebaseDb, 'orders', order.id), payload, { merge: true });
      }

      order.items = cleanedItems;
      order.syncedToCloud = true;
      delete order.cloudError;
      syncedCount++;
    } catch (err: any) {
      errors.push(`Đơn ${order.orderCode}: ${err.message || 'Lỗi lưu Firestore'}`);
    }
  }

  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(localOrders));
  return { syncedCount, errors };
};

export const saveNewsletterSubscription = async (email: string) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Vui lòng nhập địa chỉ email hợp lệ.');
  }

  if (firebaseDb) {
    try {
      await addDoc(collection(firebaseDb, 'newsletterSubscribers'), {
        email: normalizedEmail,
        status: 'subscribed',
        source: 'website-newsletter',
        createdAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn('Lỗi lưu email nhận tin lên Firestore, lưu bản sao local:', err);
    }
  }

  // Backup local nếu Firestore chưa cấp quyền
  try {
    const raw = localStorage.getItem('hv_newsletter_subscribers') || '[]';
    const list = JSON.parse(raw);
    if (!list.includes(normalizedEmail)) {
      list.push(normalizedEmail);
      localStorage.setItem('hv_newsletter_subscribers', JSON.stringify(list));
    }
  } catch {}
};