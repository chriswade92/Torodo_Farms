import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const orders = [
  {
    id: 'ORD001',
    date: '2024-04-06',
    status: 'Delivered',
    items: [
      { name: 'Fresh Milk', quantity: '2L', price: '₹100' },
      { name: 'Curd', quantity: '500g', price: '₹40' },
    ],
    total: '₹140',
  },
  {
    id: 'ORD002',
    date: '2024-04-05',
    status: 'Processing',
    items: [
      { name: 'Paneer', quantity: '1kg', price: '₹200' },
      { name: 'Ghee', quantity: '500g', price: '₹250' },
    ],
    total: '₹450',
  },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          My Orders
        </ThemedText>
      </ThemedView>

      {orders.map((order) => (
        <TouchableOpacity key={order.id} style={styles.orderCard}>
          <ThemedView style={styles.orderHeader}>
            <ThemedText style={styles.orderId}>Order #{order.id}</ThemedText>
            <ThemedText
              style={[
                styles.orderStatus,
                { color: order.status === 'Delivered' ? '#2ecc71' : '#f39c12' },
              ]}>
              {order.status}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.orderDate}>
            <ThemedText style={styles.dateText}>{order.date}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.orderItems}>
            {order.items.map((item, index) => (
              <ThemedView key={index} style={styles.itemRow}>
                <ThemedText style={styles.itemName}>
                  {item.name} ({item.quantity})
                </ThemedText>
                <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedView style={styles.orderTotal}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalAmount}>{order.total}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
  },
  orderCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDate: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
}); 