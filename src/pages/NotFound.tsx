import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 — Trang Không Tồn Tại — HV CLOTHING';
  }, []);

  return (
    <div className="w-full bg-[#faf9f6] py-28 min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto">
        <span className="font-serif text-6xl text-neutral-300 font-light block mb-2">404</span>
        <h1 className="font-serif text-3xl text-neutral-900 mb-3">
          Trang Không Tồn Tại
        </h1>
        <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang vị trí khác trong bộ sưu tập.
        </p>
        <Link to="/" className="btn-luxury inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>VỀ TRANG CHỦ</span>
        </Link>
      </div>
    </div>
  );
};
