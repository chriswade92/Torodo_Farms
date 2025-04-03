import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Product } from '../constants/products';
import { useStock } from '../contexts/StockContext';
import { warehouses } from '../constants/warehouses';

interface StockHistoryProps {
  product: Product;
}

export const StockHistory: React.FC<StockHistoryProps> = ({ product }) => {
  const { getStockHistory } = useStock();
  const history = getStockHistory(product.id);

  const getWarehouseName = (id: string) => {
    const warehouse = warehouses.find(w => w.id === id);
    return warehouse?.name || id;
  };

  const getTransactionDescription = (transaction: any) => {
    switch (transaction.type) {
      case 'TRANSFER':
        return `Transferred ${transaction.quantity} units from ${getWarehouseName(transaction.fromWarehouseId)} to ${getWarehouseName(transaction.toWarehouseId)}`;
      case 'DELIVERY':
        return `Received ${transaction.quantity} units at ${getWarehouseName(transaction.toWarehouseId)}`;
      case 'SALE':
        return `Sold ${transaction.quantity} units from ${getWarehouseName(transaction.fromWarehouseId)}`;
      case 'RETURN':
        return `Returned ${transaction.quantity} empty bottles to ${getWarehouseName(transaction.toWarehouseId)}`;
      default:
        return `${transaction.type}: ${transaction.quantity} units`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock History</Text>
      <ScrollView style={styles.historyList}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          history.map(transaction => (
            <View key={transaction.id} style={styles.historyItem}>
              <Text style={styles.date}>
                {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
              </Text>
              <Text style={styles.description}>
                {getTransactionDescription(transaction)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
}); 