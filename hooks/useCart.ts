import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  productId: number;
  name: string;
  size: string;
  quantity: number;
}

const CART_STORAGE_KEY = '@torodofarms_cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    if (!isLoading) {
      saveCart();
    }
  }, [cart, isLoading]);

  const addToCart = useCallback((productId: number, name: string, size: string, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, name, size, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: number, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
} 