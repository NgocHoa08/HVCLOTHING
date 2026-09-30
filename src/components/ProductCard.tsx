import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice } from '../data/products';
import { ProductBadge } from './ProductBadge';
import { useCart } from '../context/CartContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useCart();
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/product/${product.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-transparent cursor-pointer select-none"
    >
      {/* 3:4 Aspect Ratio Image Container (No border, No heavy shadow) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F5]">
        
        {/* Subtle Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <ProductBadge badge={product.badge} inStock={product.inStock} />
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorited
              ? 'bg-white text-rose-600 shadow-sm opacity-100'
              : 'bg-white/90 text-[#111111] hover:bg-[#111111] hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Lưu vào yêu thích"
          title="Yêu thích"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600 text-rose-600' : 'stroke-[1.5]'}`} />
        </button>

        {/* Two Images with 0.4s Smooth Crossfade */}
        <div className="w-full h-full relative">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ease-out ${
              isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {hasSecondImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} view 2`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ease-out ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Desktop Hover Quick Actions (Quick View & ADD TO BAG) */}
        <div
          className={`absolute inset-x-2.5 bottom-2.5 z-20 hidden sm:flex flex-col gap-1.5 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(product);
              }}
              className="flex-1 py-2.5 px-2 bg-white/95 text-[#111111] hover:bg-[#111111] hover:text-white text-[10px] tracking-[0.16em] uppercase font-medium transition-colors flex items-center justify-center gap-1 shadow-sm"
              title="Xem nhanh chi tiết"
            >
              <Eye className="w-3 h-3" />
              <span>XEM NHANH</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={!product.inStock}
              className={`flex-1 py-2.5 px-2 text-[10px] tracking-[0.16em] uppercase font-medium transition-colors flex items-center justify-center gap-1 shadow-sm ${
                product.inStock
                  ? 'bg-[#111111] text-white hover:bg-black'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
              title="Thêm vào túi đồ"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{product.inStock ? 'THÊM VÀO TÚI' : 'HẾT HÀNG'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Action button */}
        <div className="absolute bottom-2 right-2 z-20 sm:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center text-[#111111] shadow-sm"
            aria-label="Xem nhanh"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Information Below: Name, Category, Price */}
      <div className="pt-3 flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#777777] font-sans font-light">
          {product.categoryLabel}
        </span>

        <h3 className="font-sans text-xs sm:text-sm font-normal text-[#111111] mt-0.5 line-clamp-1 group-hover:text-neutral-600 transition-colors">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          {product.salePrice ? (
            <>
              <span className="text-xs sm:text-sm font-serif font-medium text-[#111111]">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-[11px] text-[#888888] line-through font-serif">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-serif font-medium text-[#111111]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
