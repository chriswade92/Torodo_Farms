import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useSales } from '../contexts/SalesContext';

/**
 * @interface CartItem
 * @description Représente un article dans le panier
 * @property {Object} product - Le produit laitier
 * @property {string} product.name - Nom du produit
 * @property {Object} size - Information sur la taille du produit
 * @property {number} size.size - Taille en litres
 * @property {number} size.price - Prix unitaire
 * @property {number} quantity - Quantité commandée
 */

/**
 * @component CartScreen
 * @description Écran principal du panier d'achat permettant aux utilisateurs de:
 * - Voir les articles dans leur panier
 * - Modifier les quantités
 * - Supprimer des articles
 * - Confirmer la commande
 * 
 * @example
 * ```tsx
 * <CartScreen />
 * ```
 */
export const CartScreen = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { addSale } = useSales();

  /**
   * @function handleConfirmOrder
   * @description Gère la confirmation de la commande avec une boîte de dialogue
   * Vérifie si le panier n'est pas vide, calcule le total et ajoute la vente
   * à l'historique après confirmation
   */
  const handleConfirmOrder = () => {
    if (items.length === 0) {
      Alert.alert('Erreur', 'Votre panier est vide');
      return;
    }

    Alert.alert(
      'Confirmer la commande',
      `Total: ${total} CFA\nVoulez-vous confirmer votre commande?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: () => {
            addSale(items, total);
            Alert.alert('Succès', 'Votre commande a été confirmée!');
            clearCart();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier</Text>
      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.itemDetails}>
                {item.size.size}L x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>
                {item.size.price * item.quantity} CFA
              </Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(index, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(index)}
              >
                <Text style={styles.removeButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.total}>Total: {total} CFA</Text>
        <TouchableOpacity
          style={[styles.confirmButton, items.length === 0 && styles.disabledButton]}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmButtonText}>Confirmer la commande</Text>
        </TouchableOpacity>
      </View>
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
  itemsContainer: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  itemInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginTop: 5,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 