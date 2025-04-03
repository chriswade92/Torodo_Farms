import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Product, ProductSize } from '../constants/products';
import { useSubscription } from '../contexts/SubscriptionContext';
import { warehouses } from '../constants/warehouses';

interface SubscriptionFormProps {
  product: Product;
  customerId: string;
  onComplete?: () => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  product,
  customerId,
  onComplete,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState('');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [warehouseId, setWarehouseId] = useState('');
  const { addSubscription } = useSubscription();

  const handleSubscribe = () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }
    if (!warehouseId) {
      Alert.alert('Error', 'Please select a warehouse');
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const nextDelivery = new Date();
    switch (frequency) {
      case 'DAILY':
        nextDelivery.setDate(nextDelivery.getDate() + 1);
        break;
      case 'WEEKLY':
        nextDelivery.setDate(nextDelivery.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDelivery.setMonth(nextDelivery.getMonth() + 1);
        break;
    }

    addSubscription({
      productId: product.id,
      size: selectedSize,
      quantity: qty,
      frequency,
      nextDelivery,
      customerId,
      warehouseId,
      active: true,
    });

    Alert.alert('Success', 'Subscription created successfully');
    onComplete?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe to {product.name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Select Size</Text>
        <View style={styles.sizesContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size.size}
              style={[
                styles.sizeButton,
                selectedSize?.size === size.size && styles.selectedButton,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.buttonText,
                selectedSize?.size === size.size && styles.selectedText,
              ]}>
                {size.size}L - {size.price} CFA
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Delivery Frequency</Text>
        <View style={styles.frequencyContainer}>
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                frequency === freq && styles.selectedButton,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text style={[
                styles.buttonText,
                frequency === freq && styles.selectedText,
              ]}>
                {freq.charAt(0) + freq.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Warehouse</Text>
        <View style={styles.warehouseContainer}>
          {warehouses.map((warehouse) => (
            <TouchableOpacity
              key={warehouse.id}
              style={[
                styles.warehouseButton,
                warehouseId === warehouse.id && styles.selectedButton,
              ]}
              onPress={() => setWarehouseId(warehouse.id)}
            >
              <Text style={[
                styles.buttonText,
                warehouseId === warehouse.id && styles.selectedText,
              ]}>
                {warehouse.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
      </View>

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
      >
        <Text style={styles.subscribeButtonText}>Create Subscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeButton: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    width: '32%',
  },
  warehouseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warehouseButton: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    width: '48%',
  },
  selectedButton: {
    backgroundColor: '#2B78E4',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
  },
  input: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: '#2B78E4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 