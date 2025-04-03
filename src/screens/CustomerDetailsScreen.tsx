import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '@types/navigation';

type CustomerDetailsScreenRouteProp = RouteProp<CustomerStackParamList, 'CustomerDetails'>;

export const CustomerDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<CustomerDetailsScreenRouteProp>();
  const { customerId } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Customer Details</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => {}}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Information</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>John Doe</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
          <Text style={[styles.value, { color: colors.text }]}>+1234567890</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>john@example.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Address</Text>
          <Text style={[styles.value, { color: colors.text }]}>123 Main St, City</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Subscription Details</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Status</Text>
          <Text style={[styles.value, { color: colors.text }]}>Active</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Plan</Text>
          <Text style={[styles.value, { color: colors.text }]}>Daily 1L</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Start Date</Text>
          <Text style={[styles.value, { color: colors.text }]}>Jan 1, 2024</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Next Delivery</Text>
          <Text style={[styles.value, { color: colors.text }]}>Tomorrow</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Order History</Text>
        <Text style={[styles.cardText, { color: colors.text }]}>No order history</Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
  },
  cardText: {
    fontSize: 16,
  },
}); 