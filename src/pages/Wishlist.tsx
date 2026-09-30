import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { wishlist } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    document.title = 'Danh sách yêu thích — HV CLOTHING';
    window.scrollTo(0, 0);
  }, []);

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full bg-white py-12 lg:py-20 min-h-[75vh]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="mb-10 pb-4 border-b border-[#E8E8E8] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-medium block mb-1">
              DANH SÁCH LƯU TRỮ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal">
              SẢN PHẨM YÊU THÍCH
            </h1>
          </div>
          <span className="text-xs text-[#777777] tracking-wider uppercase">
            {savedProducts.length} sản phẩm
          </span>
        </div>

        {/* Empty State vs Products Grid */}
        {savedProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 border border-[#E8E8E8] mx-auto flex items-center justify-center mb-6 bg-[#F7F7F5]">
              <Heart className="w-7 h-7 text-[#777777] stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-3xl text-[#111111] font-normal mb-2">
              DANH SÁCH ĐANG TRỐNG
            </h2>
            <p className="text-xs text-[#777777] font-light leading-relaxed mb-8 font-sans">
              Lưu lại những thiết kế mà bạn ưng ý bằng biểu tượng trái tim để dễ dàng tìm kiếm và cân nhắc sau.
            </p>
            <Link to="/shop" className="btn-luxury inline-flex items-center gap-2">
              <span>KHÁM PHÁ CỬA HÀNG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-10">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
