import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SaleSection: React.FC = () => {
  const { products } = useProducts();
  // Items on sale
  const saleProducts = products.filter((p) => p.badge === 'SALE' || Boolean(p.salePrice)).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="relative mb-14 bg-[#111111] text-white p-8 sm:p-12 lg:p-16 border border-neutral-800 overflow-hidden">
          {/* Subtle background luxury texture / ambient glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8b2635]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-rose-300 text-xs tracking-[0.25em] uppercase font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIMITED TIME CURATION</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mb-2 text-white">
                SEASON SALE
              </h2>
              <p className="font-serif text-2xl sm:text-3xl text-neutral-300 font-light italic mb-4">
                UP TO 30% OFF
              </p>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                Cơ hội sở hữu những thiết kế kinh điển từ các bộ sưu tập trước với mức giá ưu đãi đặc quyền. Số lượng có hạn theo từng size.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/shop?filter=sale"
                className="btn-luxury-white inline-flex items-center gap-2 group"
              >
                <span>SHOP SALE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Sale Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
