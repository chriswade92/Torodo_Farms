import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Product, ProductSize } from '../constants/products';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedBadge, setShowAddedBadge] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { addToCart } = useCart();

  const animateBadge = useCallback(() => {
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowAddedBadge(false));
  }, [fadeAnim]);

  const handleOrder = () => {
    if (!selectedSize) {
      Alert.alert('Erreur', 'Veuillez sélectionner une taille');
      return;
    }
    addToCart(product, selectedSize, quantity);
    setShowAddedBadge(true);
    animateBadge();
    setSelectedSize(null);
    setQuantity(1);
  };

  return (
    <View style={styles.card}>
      {showAddedBadge && (
        <Animated.View
          style={[
            styles.badge,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.badgeText}>Ajouté au panier!</Text>
        </Animated.View>
      )}
      <Image source={product.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.sizesContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size.size}
              style={[
                styles.sizeButton,
                selectedSize?.size === size.size && styles.selectedSize,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[
                styles.sizeText,
                selectedSize?.size === size.size && styles.selectedText,
              ]}>{size.size}L</Text>
              <Text style={[
                styles.priceText,
                selectedSize?.size === size.size && styles.selectedText,
              ]}>{size.price} CFA</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.orderButton, !selectedSize && styles.disabledButton]}
          onPress={handleOrder}
          disabled={!selectedSize}
        >
          <Text style={styles.orderButtonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  sizesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  selectedSize: {
    backgroundColor: '#007AFF',
  },
  sizeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
  priceText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 20,
    color: '#333',
  },
  orderButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 