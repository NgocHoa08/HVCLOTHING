import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products } = useProducts();
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="py-20 lg:py-28 bg-[#faf9f6] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-neutral-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-2">
              CURATED SELECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal tracking-tight">
              FEATURED PRODUCTS
            </h2>
          </div>

          <Link
            to="/shop"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-neutral-700 hover:text-black transition-colors"
          >
            <span>XEM TẤT CẢ SẢN PHẨM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link to="/shop" className="btn-luxury-outline inline-flex">
            KHÁM PHÁ TOÀN BỘ BỘ SƯU TẬP
          </Link>
        </div>

      </div>
    </section>
  );
};
