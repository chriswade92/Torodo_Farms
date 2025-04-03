import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  STOCKS: 'stocks',
  TRANSACTIONS: 'transactions',
  SUBSCRIPTIONS: 'subscriptions',
  CUSTOMERS: 'customers',
  ANALYTICS: 'analytics',
  THEME_PREFERENCE: 'theme_preference',
} as const;

export const storage = {
  save: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  load: async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
}; 