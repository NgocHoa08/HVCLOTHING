import React, { useState } from 'react';
import { useProducts } from '../context/useProducts';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

type TabCategory = 'ALL' | 'WOMEN' | 'MEN' | 'ACCESSORIES';

const TAB_LABELS: Record<TabCategory, string> = {
  ALL: 'TẤT CẢ',
  WOMEN: 'NỮ',
  MEN: 'NAM',
  ACCESSORIES: 'PHỤ KIỆN',
};

export const NewArrivalsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabCategory>('ALL');
  const { products } = useProducts();

  // Filter new arrivals items, fallback to all products if few items marked isNew
  const newItems = products.filter((p) => p.isNew || p.badge === 'NEW');
  const basePool = newItems.length >= 4 ? newItems : products;

  const filtered = basePool.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'WOMEN') return item.gender === 'women' || item.gender === 'unisex';
    if (activeTab === 'MEN') return item.gender === 'men' || item.gender === 'unisex';
    if (activeTab === 'ACCESSORIES') return item.category === 'accessories';
    return true;
  }).slice(0, 8);

  const tabs: TabCategory[] = ['ALL', 'WOMEN', 'MEN', 'ACCESSORIES'];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-2">
            PHOM DÁNG MÙA MỚI
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight mb-8">
            HÀNG MỚI VỀ
          </h2>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 border-b border-[#E8E8E8] pb-3 w-full max-w-md">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 text-xs tracking-[0.16em] font-medium uppercase transition-colors ${
                  activeTab === tab
                    ? 'text-[#111111] font-semibold'
                    : 'text-[#777777] hover:text-[#111111]'
                }`}
              >
                {TAB_LABELS[tab]}
                {activeTab === tab && (
                  <motion.div
                    layoutId="novaeTabUnderline"
                    className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#111111]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Columns Desktop, 2 Columns Mobile with AnimatePresence */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
