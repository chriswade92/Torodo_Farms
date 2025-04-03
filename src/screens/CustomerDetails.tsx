import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useCustomer } from '../contexts/CustomerContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export const CustomerDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const customerId = route.params?.customerId;
  const { colors } = useTheme();
  const { getCustomer } = useCustomer();

  const customer = getCustomer(customerId);

  if (!customer) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Customer not found</Text>
      </View>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderOrderHistory = () => {
    // This is a placeholder for order history
    // You'll need to implement this when you have the order tracking system
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order History</Text>
        <Text style={[styles.placeholder, { color: colors.secondaryText }]}>
          Order history will be available soon
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Customer Details</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.name, { color: colors.text }]}>{customer.name}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{customer.phone}</Text>
        </View>

        {customer.email && (
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{customer.email}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{customer.address}</Text>
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{customer.totalOrders}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Total Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>₹{customer.totalSpent.toFixed(2)}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Total Spent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatDate(customer.createdAt)}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Customer Since</Text>
        </View>
      </View>

      {customer.lastOrder && (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Last Order</Text>
          <Text style={[styles.dateText, { color: colors.secondaryText }]}>
            {formatDate(customer.lastOrder)}
          </Text>
        </View>
      )}

      {renderOrderHistory()}

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CustomerManagement', { editCustomerId: customer.id })}
      >
        <Ionicons name="create" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Customer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  statsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
  },
  placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 24,
    elevation: 2,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 