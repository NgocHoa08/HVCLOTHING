import { createContext } from 'react';
import type { Product } from '../types/product';

export interface ProductContextValue {
  products: Product[];
  loading: boolean;
  error: string;
  firebaseConfigured: boolean;
  saveProduct: (product: Product, isNew: boolean) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  seedDefaultCatalog: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextValue | null>(null);