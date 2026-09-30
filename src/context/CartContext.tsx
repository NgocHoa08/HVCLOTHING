import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, ProductColor } from '../types/product';

interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (productId: string, size: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  shippingFee: number;
  total: number;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Cart Drawer
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals & Drawers state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Toast
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'novae_cart_data';
const WISHLIST_STORAGE_KEY = 'novae_wishlist_data';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load initial wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity: number = 1,
    openDrawer: boolean = true
  ) => {
    if (!product.inStock) {
      addToast(`Sản phẩm "${product.name}" hiện tạm hết hàng`, 'error');
      return;
    }

    const chosenSize = size || product.sizes[0] || 'M';
    const chosenColor = color || product.colors[0] || { name: 'Noir', hex: '#111111' };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.name === chosenColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });

    addToast(`Đã thêm "${product.name}" (${chosenSize}, ${chosenColor.name}) vào túi đồ`, 'success');
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart((prev) => {
      const removed = prev.find(
        (item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.name === colorName
      );
      if (removed) {
        addToast(`Đã xóa "${removed.product.name}" khỏi túi đồ`, 'info');
      }
      return prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      );
    });
  };

  const updateQuantity = (
    productId: string,
    size: string,
    colorName: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.name === colorName
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'HV10' || trimmed === 'NOVAE10' || trimmed === 'WELCOME10') {
      setCouponCode(trimmed);
      setDiscountPercent(0.1);
      addToast('Áp dụng mã ưu đãi HV CLOTHING 10% thành công!', 'success');
      return true;
    } else if (trimmed === 'VIP20' || trimmed === 'SUMMER20') {
      setCouponCode(trimmed);
      setDiscountPercent(0.2);
      addToast('Áp dụng đặc quyền thành viên VIP 20% thành công!', 'success');
      return true;
    } else {
      addToast('Mã ưu đãi không hợp lệ hoặc đã hết hạn (Thử mã: HV10)', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    addToast('Đã hủy áp dụng mã ưu đãi', 'info');
  };

  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      setWishlist((prev) => [...prev, productId]);
      addToast('Đã thêm sản phẩm vào danh sách yêu thích', 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast('Đã xóa khỏi danh sách yêu thích', 'info');
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discount = Math.round(subtotal * discountPercent);
  // Free shipping above 1,000,000 VND as requested
  const shippingFee = subtotal >= 1000000 || subtotal === 0 ? 0 : 35000;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const getCartTotal = () => total;
  const getCartCount = () => cartCount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        shippingFee,
        total,
        getCartTotal,
        getCartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isSearchOpen,
        setIsSearchOpen,
        isQuickViewOpen: !!quickViewProduct,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isWishlistOpen,
        setIsWishlistOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
