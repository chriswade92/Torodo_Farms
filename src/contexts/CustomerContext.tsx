import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  createdAt: Date;
  lastOrder?: Date;
  totalOrders: number;
  totalSpent: number;
  preferredWarehouseId?: string;
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  getCustomer: (id: string) => Customer | undefined;
  searchCustomers: (query: string) => Customer[];
  updateCustomerStats: (customerId: string, orderAmount: number) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Load saved customers
  useEffect(() => {
    const loadCustomers = async () => {
      const saved = await storage.load('CUSTOMERS');
      if (saved) {
        setCustomers(saved.map((customer: any) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          lastOrder: customer.lastOrder ? new Date(customer.lastOrder) : undefined,
        })));
      }
    };
    loadCustomers();
  }, []);

  // Save customers when updated
  useEffect(() => {
    storage.save('CUSTOMERS', customers);
  }, [customers]);

  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  }, []);

  const getCustomer = useCallback((id: string) => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  const searchCustomers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.phone.includes(query) ||
      customer.email?.toLowerCase().includes(lowercaseQuery)
    );
  }, [customers]);

  const updateCustomerStats = useCallback((customerId: string, orderAmount: number) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === customerId
        ? {
            ...customer,
            lastOrder: new Date(),
            totalOrders: customer.totalOrders + 1,
            totalSpent: customer.totalSpent + orderAmount,
          }
        : customer
    ));
  }, []);

  return (
    <CustomerContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      getCustomer,
      searchCustomers,
      updateCustomerStats,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}; 