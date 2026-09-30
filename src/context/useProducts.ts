import { useContext } from 'react';
import { ProductContext } from './product-context';

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside ProductProvider');
  return context;
};