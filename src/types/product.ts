export type ProductCategory = 'women' | 'men' | 'accessories' | 'collections';

export type ProductBadgeType = 'NEW' | 'BEST SELLER' | 'SALE';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory: string;
  gender: 'women' | 'men' | 'unisex';
  price: number;
  salePrice?: number;
  description: string;
  details: string[];
  material: string;
  care: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviews: number;
  badge?: ProductBadgeType;
  inStock: boolean;
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface FilterState {
  category: string;
  subcategory: string;
  gender: string;
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  searchQuery: string;
}
