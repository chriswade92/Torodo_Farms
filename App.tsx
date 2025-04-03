/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@contexts/ThemeContext';
import { StockProvider } from '@contexts/StockContext';
import { AppNavigator } from '@navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StockProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </StockProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
