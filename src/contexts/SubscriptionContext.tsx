import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, ProductSize } from '../constants/products';

interface Subscription {
  id: string;
  productId: string;
  size: ProductSize;
  quantity: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  nextDelivery: Date;
  customerId: string;
  warehouseId: string;
  active: boolean;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  cancelSubscription: (id: string) => void;
  getCustomerSubscriptions: (customerId: string) => Subscription[];
  getProductSubscriptions: (productId: string) => Subscription[];
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const addSubscription = useCallback((subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  }, []);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, active: false } : sub
    ));
  }, []);

  const getCustomerSubscriptions = useCallback((customerId: string) => {
    return subscriptions.filter(sub => sub.customerId === customerId);
  }, [subscriptions]);

  const getProductSubscriptions = useCallback((productId: string) => {
    return subscriptions.filter(sub => sub.productId === productId);
  }, [subscriptions]);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      addSubscription,
      updateSubscription,
      cancelSubscription,
      getCustomerSubscriptions,
      getProductSubscriptions,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 