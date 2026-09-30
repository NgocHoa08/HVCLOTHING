import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CategoryIntro } from '../components/CategoryIntro';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { BestsellersSection } from '../components/BestsellersSection';
import { EditorialSection } from '../components/EditorialSection';
import { CollectionBanner } from '../components/CollectionBanner';
import { NewArrivalsSection } from '../components/NewArrivalsSection';
import { SalePromotionSection } from '../components/SalePromotionSection';
import { BrandStorySection } from '../components/BrandStorySection';
import { InstagramSection } from '../components/InstagramSection';
import { Newsletter } from '../components/Newsletter';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'HV CLOTHING — Fashion For Your Style';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white">
      {/* 07 & 08. Hero Section */}
      <Hero />

      {/* 09. Category Intro */}
      <CategoryIntro />

      {/* 10. Category Grid (Women, Men, Accessories) */}
      <CategoryGrid />

      {/* 11. Featured Collection */}
      <FeaturedCollection />

      {/* 12. Bestsellers Products */}
      <BestsellersSection />

      {/* 16. Editorial Section: The HV CLOTHING Journal */}
      <EditorialSection />

      {/* 17. Collection Banner */}
      <CollectionBanner />

      {/* 18. New Arrivals with Filter Tabs */}
      <NewArrivalsSection />

      {/* 19. Sale / Promotion */}
      <SalePromotionSection />

      {/* 20. Brand Story */}
      <BrandStorySection />

      {/* 21. Instagram Grid & Lightbox */}
      <InstagramSection />

      {/* 22. Newsletter */}
      <Newsletter />
    </div>
  );
};
