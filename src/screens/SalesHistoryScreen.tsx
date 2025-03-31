import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSales } from '../contexts/SalesContext';

export const SalesHistoryScreen = () => {
  const { sales } = useSales();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Ventes</Text>
      <ScrollView style={styles.salesContainer}>
        {sales.length === 0 ? (
          <Text style={styles.emptyText}>Aucune vente enregistrée</Text>
        ) : (
          sales.map((sale) => (
            <View key={sale.id} style={styles.saleCard}>
              <Text style={styles.dateText}>{formatDate(sale.date)}</Text>
              <View style={styles.itemsContainer}>
                {sale.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.product.name} ({item.size.size}L x {item.quantity})
                    </Text>
                    <Text style={styles.itemPrice}>
                      {item.size.price * item.quantity} CFA
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{sale.total} CFA</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  salesContainer: {
    flex: 1,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  saleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
}); 