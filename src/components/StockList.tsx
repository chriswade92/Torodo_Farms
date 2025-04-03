import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useStock } from '@contexts/StockContext';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
}

const stockItems: StockItem[] = [
  { id: '1', name: 'Full Cream Milk', quantity: 0 },
  { id: '2', name: 'Skimmed Milk', quantity: 0 },
  { id: '3', name: 'Chocolate Milk', quantity: 0 },
];

export const StockList: React.FC = () => {
  const { colors } = useTheme();
  const { stock } = useStock();

  const renderItem = ({ item }: { item: StockItem }) => (
    <View style={[styles.item, { backgroundColor: colors.card }]}>
      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.quantity, { color: colors.text }]}>
        {stock.warehouse1 + stock.warehouse2} L
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Stock Items</Text>
      <FlatList
        data={stockItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 