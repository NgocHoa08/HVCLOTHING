import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 w-10 h-10 bg-white/90 hover:bg-black text-neutral-800 hover:text-white border border-neutral-300 shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
    >
      <ArrowUp className="w-4 h-4 stroke-[1.5]" />
    </button>
  );
};
