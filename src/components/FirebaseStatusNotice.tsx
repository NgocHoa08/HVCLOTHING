import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useProducts } from '../context/useProducts';

export const FirebaseStatusNotice: React.FC = () => {
  const { error, firebaseConfigured } = useProducts();
  if (!firebaseConfigured || !error) return null;

  return (
    <aside role="status" className="border-b border-[#E6D5A8] bg-[#FFF9E9] px-4 py-3 text-xs text-[#715B20] sm:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2">
        <p>{error}</p>
        <a
          href="https://console.firebase.google.com/project/hv-clothings/firestore"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium underline underline-offset-2"
        >
          Mở Firestore Console <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
};