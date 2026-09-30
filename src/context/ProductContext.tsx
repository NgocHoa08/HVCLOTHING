import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, writeBatch } from 'firebase/firestore';
import { ProductContext } from './product-context';
import { PRODUCTS } from '../data/products';
import { firebaseConfigured, firebaseDb } from '../lib/firebase';
import type { Product } from '../types/product';

const getStoredProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('hv_cached_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return firebaseConfigured ? [] : PRODUCTS;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [loading, setLoading] = useState(() => {
    // If we already have cached products, don't show blank loading screen
    if (typeof window !== 'undefined' && localStorage.getItem('hv_cached_products')) return false;
    return firebaseConfigured;
  });
  const [error, setError] = useState(firebaseConfigured ? '' : 'Firebase chưa được cấu hình.');

  useEffect(() => {
    if (!firebaseDb) return;
    return onSnapshot(collection(firebaseDb, 'products'), (snapshot) => {
      const items = snapshot.docs.map((productDoc) => {
        const data = productDoc.data();
        return {
          ...data,
          id: productDoc.id,
          name: typeof data.name === 'string' ? data.name : 'Sản phẩm',
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'],
          price: typeof data.price === 'number' ? data.price : 0,
          sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['M'],
          colors: Array.isArray(data.colors) && data.colors.length > 0 ? data.colors : [{ name: 'Noir', hex: '#111111' }],
        } as Product;
      });
      items.sort((left, right) => (left.name || '').localeCompare(right.name || ''));
      setProducts(items);
      setError('');
      setLoading(false);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hv_cached_products', JSON.stringify(items));
        } catch {}
      }
    }, (snapshotError) => {
      const message = snapshotError.message.toLowerCase();
      if (message.includes("database '(default)' not found") || message.includes('database not found')) {
        setError('Chưa tạo Firestore Database cho dự án Firebase này. Hãy tạo Firestore Database trong Firebase Console.');
      } else if (snapshotError.code === 'permission-denied') {
        setError('Firestore từ chối quyền đọc. Hãy kiểm tra rules Firestore.');
      } else {
        setError(`Không kết nối được Firestore: ${snapshotError.message}`);
      }
      setLoading(false);
      // Keep existing products or cached products, never overwrite user products with sample catalog
      setProducts((prev) => (prev.length > 0 ? prev : (firebaseConfigured ? [] : PRODUCTS)));
    });
  }, []);

  const saveProduct = async (product: Product, isNew: boolean) => {
    if (!firebaseDb) throw new Error('Chưa cấu hình Firebase trong file .env.');
    const productRef = doc(firebaseDb, 'products', product.id);
    const currentProduct = await getDoc(productRef);
    if (isNew && currentProduct.exists()) throw new Error('Mã sản phẩm đã tồn tại.');
    if (!isNew && !currentProduct.exists()) throw new Error('Không tìm thấy sản phẩm trong Firestore.');
    const productData = Object.fromEntries(
      Object.entries(product).filter(([, value]) => value !== undefined),
    );
    await setDoc(productRef, productData);
  };

  const deleteProduct = async (productId: string) => {
    if (!firebaseDb) throw new Error('Chưa cấu hình Firebase trong file .env.');
    await deleteDoc(doc(firebaseDb, 'products', productId));
  };

  const seedDefaultCatalog = async () => {
    if (!firebaseDb) throw new Error('Chưa cấu hình Firebase trong file .env.');
    const catalog = await getDocs(collection(firebaseDb, 'products'));
    if (!catalog.empty) throw new Error('Firestore đã có sản phẩm, không nhập catalog mẫu để tránh ghi đè.');
    const batch = writeBatch(firebaseDb);
    for (const product of PRODUCTS) {
      const productData = Object.fromEntries(
        Object.entries(product).filter(([, value]) => value !== undefined),
      );
      batch.set(doc(firebaseDb, 'products', product.id), productData);
    }
    await batch.commit();
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, firebaseConfigured, saveProduct, deleteProduct, seedDefaultCatalog }}>
      {children}
    </ProductContext.Provider>
  );
};