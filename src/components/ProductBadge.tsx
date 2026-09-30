import React from 'react';
import type { ProductBadgeType } from '../types/product';

interface ProductBadgeProps {
  badge?: ProductBadgeType;
  inStock?: boolean;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({ badge, inStock = true }) => {
  if (!inStock) {
    return (
      <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase font-medium bg-[#E8E8E8] text-[#555555]">
        HẾT HÀNG
      </span>
    );
  }

  if (!badge) return null;

  switch (badge) {
    case 'NEW':
      return (
        <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase font-medium bg-[#111111] text-white">
          MỚI
        </span>
      );
    case 'SALE':
      return (
        <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase font-medium bg-[#2B2B2B] text-white">
          ƯU ĐÃI
        </span>
      );
    case 'BEST SELLER':
      return (
        <span className="inline-block px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase font-medium bg-[#F7F7F5] text-[#111111] border border-[#E8E8E8]">
          BÁN CHẠY
        </span>
      );
    default:
      return null;
  }
};
