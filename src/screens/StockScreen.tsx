import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { StockSummary } from '@components/StockSummary';
import { StockList } from '@components/StockList';
import { StockTransfer } from '@components/StockTransfer';

export const StockScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Stock Management</Text>
      </View>
      
      <StockSummary />
      <StockList />
      <StockTransfer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 