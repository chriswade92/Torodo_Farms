import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useStock } from '@contexts/StockContext';

export const StockTransfer: React.FC = () => {
  const { colors } = useTheme();
  const { transferStock } = useStock();
  const [amount, setAmount] = useState('');

  const handleTransfer = async (fromWarehouse: 'warehouse1' | 'warehouse2', toWarehouse: 'warehouse1' | 'warehouse2') => {
    try {
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
        return;
      }

      await transferStock(fromWarehouse, toWarehouse, transferAmount);
      setAmount('');
      Alert.alert('Success', 'Stock transferred successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to transfer stock');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Transfer Stock</Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
        placeholder="Enter amount (L)"
        placeholderTextColor={colors.text}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => handleTransfer('warehouse1', 'warehouse2')}
        >
          <Text style={styles.buttonText}>Warehouse 1 → 2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => handleTransfer('warehouse2', 'warehouse1')}
        >
          <Text style={styles.buttonText}>Warehouse 2 → 1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 