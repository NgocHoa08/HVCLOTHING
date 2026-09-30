import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const BestsellersSection: React.FC = () => {
  const { products } = useProducts();
  // 4 Bestsellers items
  const bestsellers = products.filter((p) => p.isBestSeller || p.badge === 'BEST SELLER').slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Bar */}
        <div className="flex items-end justify-between mb-12 pb-4 border-b border-[#E8E8E8]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
              ĐƯỢC YÊU THÍCH NHẤT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              SẢN PHẨM BÁN CHẠY
            </h2>
          </div>

          <Link
            to="/shop?filter=bestseller"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#111111] hover:text-[#777777] transition-colors flex items-center gap-1.5 pb-1 border-b border-[#111111]"
          >
            <span>XEM TẤT CẢ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Columns Desktop, 3 Tablet, 2 Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
