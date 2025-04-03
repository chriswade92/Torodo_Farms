import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '@utils/storage';

interface Stock {
  warehouse1: number;
  warehouse2: number;
}

interface StockContextType {
  stock: Stock;
  updateStock: (warehouse: keyof Stock, amount: number) => void;
  transferStock: (fromWarehouse: keyof Stock, toWarehouse: keyof Stock, amount: number) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<Stock>({
    warehouse1: 0,
    warehouse2: 0,
  });

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const savedStock = await storage.load(STORAGE_KEYS.STOCKS);
      if (savedStock) {
        setStock(savedStock);
      }
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const updateStock = async (warehouse: keyof Stock, amount: number) => {
    try {
      const newStock = {
        ...stock,
        [warehouse]: Math.max(0, stock[warehouse] + amount),
      };
      await storage.save(STORAGE_KEYS.STOCKS, newStock);
      setStock(newStock);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const transferStock = async (fromWarehouse: keyof Stock, toWarehouse: keyof Stock, amount: number) => {
    try {
      if (stock[fromWarehouse] < amount) {
        throw new Error('Insufficient stock');
      }

      const newStock = {
        ...stock,
        [fromWarehouse]: stock[fromWarehouse] - amount,
        [toWarehouse]: stock[toWarehouse] + amount,
      };
      await storage.save(STORAGE_KEYS.STOCKS, newStock);
      setStock(newStock);
    } catch (error) {
      console.error('Error transferring stock:', error);
      throw error;
    }
  };

  return (
    <StockContext.Provider
      value={{
        stock,
        updateStock,
        transferStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}; 