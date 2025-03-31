/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CartScreen } from './src/screens/CartScreen';
import { SalesHistoryScreen } from './src/screens/SalesHistoryScreen';
import { CartProvider } from './src/contexts/CartContext';
import { SalesProvider } from './src/contexts/SalesContext';

type TabType = 'home' | 'cart' | 'history';

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'cart':
        return <CartScreen />;
      case 'history':
        return <SalesHistoryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SalesProvider>
      <CartProvider>
        <View style={styles.container}>
          {renderScreen()}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'home' && styles.activeTab]}
              onPress={() => setActiveTab('home')}
            >
              <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
                Produits
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
              onPress={() => setActiveTab('cart')}
            >
              <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
                Panier
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                Historique
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CartProvider>
    </SalesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default App;
