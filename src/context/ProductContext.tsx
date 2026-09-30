import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, writeBatch } from 'firebase/firestore';
import { ProductContext } from './product-context';
import { PRODUCTS } from '../data/products';
import { firebaseConfigured, firebaseDb } from '../lib/firebase';
import type { Product } from '../types/product';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [error, setError] = useState(firebaseConfigured ? '' : 'Firebase chưa được cấu hình. Đang hiển thị catalog mẫu.');

  useEffect(() => {
    if (!firebaseDb) return;
    return onSnapshot(collection(firebaseDb, 'products'), (snapshot) => {
      const items = snapshot.docs.map((productDoc) => ({
        ...productDoc.data(),
        id: productDoc.id,
      }) as Product);
      items.sort((left, right) => left.name.localeCompare(right.name));
      setProducts(items);
      setError('');
      setLoading(false);
    }, (snapshotError) => {
      const message = snapshotError.message.toLowerCase();
      if (message.includes("database '(default)' not found") || message.includes('database not found')) {
        setError('Chưa tạo Firestore Database cho dự án Firebase này. Hãy tạo Firestore Database trong Firebase Console; hiện đang dùng catalog mẫu.');
      } else if (snapshotError.code === 'permission-denied') {
        setError('Firestore từ chối quyền đọc. Hãy deploy firestore.rules cho đúng Firebase project; hiện đang dùng catalog mẫu.');
      } else {
        setError(`Không kết nối được Firestore: ${snapshotError.message}. Hiện đang dùng catalog mẫu.`);
      }
      setLoading(false);
      setProducts(PRODUCTS);
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