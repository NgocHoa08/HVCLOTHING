import React from 'react';
import { useCart } from '../context/CartContext';
import { Check, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#111111] text-white px-4 py-3.5 shadow-2xl flex items-start justify-between gap-3 border border-neutral-800 text-xs"
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span className="font-light tracking-wide text-neutral-200 leading-relaxed">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors shrink-0 p-0.5"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
