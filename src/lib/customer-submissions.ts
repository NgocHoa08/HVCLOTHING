import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from './firebase';
import type { CartItem } from '../types/product';

interface PlaceOrderInput {
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

export const saveOrder = async (input: PlaceOrderInput) => {
  if (!firebaseDb) throw new Error('Chưa cấu hình Firebase. Không thể gửi đơn hàng.');

  const orderCode = `HV-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const order = {
    orderCode,
    customer: {
      email: input.email.trim().toLowerCase(),
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
    },
    shipping: {
      address: input.address.trim(),
      city: input.city,
      district: input.district.trim(),
      ward: input.ward.trim(),
    },
    items: input.items.map((item) => {
      const unitPrice = item.product.salePrice ?? item.product.price;
      return {
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images[0] ?? '',
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    }),
    subtotal: input.subtotal,
    discount: input.discount,
    couponCode: input.couponCode,
    shippingFee: input.shippingFee,
    total: input.total,
    paymentMethod: input.paymentMethod,
    status: 'new',
    userId: firebaseAuth?.currentUser?.uid ?? null,
    createdAt: serverTimestamp(),
  };

  const saved = await addDoc(collection(firebaseDb, 'orders'), order);
  return { id: saved.id, orderCode };
};

export const saveNewsletterSubscription = async (email: string) => {
  if (!firebaseDb) throw new Error('Chưa cấu hình Firebase. Không thể lưu email đăng ký.');
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Vui lòng nhập địa chỉ email hợp lệ.');
  }

  await addDoc(collection(firebaseDb, 'newsletterSubscribers'), {
    email: normalizedEmail,
    status: 'subscribed',
    source: 'website-newsletter',
    createdAt: serverTimestamp(),
  });
};