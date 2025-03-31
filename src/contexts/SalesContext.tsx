import React, { createContext, useContext, useState } from 'react';
import { Product, ProductSize } from '../constants/products';

export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: number;
}

interface SaleRecord {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
}

interface SalesContextType {
  sales: SaleRecord[];
  addSale: (items: CartItem[], total: number) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<SaleRecord[]>([]);

  const addSale = (items: CartItem[], total: number) => {
    const newSale: SaleRecord = {
      id: Date.now().toString(),
      items: [...items],
      total,
      date: new Date(),
    };
    setSales([newSale, ...sales]);
  };

  return (
    <SalesContext.Provider value={{ sales, addSale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}; 