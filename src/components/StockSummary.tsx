import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useStock } from '@contexts/StockContext';
import { Product } from '../constants/products';

interface StockSummaryProps {
  product: Product;
}

export const StockSummary: React.FC<StockSummaryProps> = ({ product }) => {
  const { colors } = useTheme();
  const { stock } = useStock();

  const totalStock = Object.values(stock).reduce((acc, curr) => acc + curr, 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={[styles.label, { color: colors.text }]}>Total Stock</Text>
          <Text style={[styles.value, { color: colors.text }]}>{totalStock} L</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.label, { color: colors.text }]}>Warehouse 1</Text>
          <Text style={[styles.value, { color: colors.text }]}>{stock.warehouse1} L</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.label, { color: colors.text }]}>Warehouse 2</Text>
          <Text style={[styles.value, { color: colors.text }]}>{stock.warehouse2} L</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  container: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 