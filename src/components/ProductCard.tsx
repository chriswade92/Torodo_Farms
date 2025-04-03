import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Product, ProductSize } from '../constants/products';
import { useCart } from '../contexts/CartContext';
import { useStock } from '../contexts/StockContext';
import { StockSummary } from './StockSummary';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  StockSummary: { product: Product };
};

interface ProductCardProps {
  product: Product;
  onStockPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onStockPress }) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const { addToCart } = useCart();
  const { getAllStockForProduct } = useStock();
  const stocks = getAllStockForProduct(product.id);
  const totalStock = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleOrder = () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }
    addToCart(product, selectedSize, 1);
    setSelectedSize(null);
  };

  return (
    <View style={styles.card}>
      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.stockInfo}>Available Stock: {totalStock}</Text>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleOrder}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('StockSummary', { product })}
          >
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

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
                selectedSize?.size === size.size && styles.selectedSizeText,
              ]}>{size.size}L</Text>
              <Text style={[
                styles.priceText,
                selectedSize?.size === size.size && styles.selectedSizeText,
              ]}>{size.price} CFA</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <StockSummary product={product} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    marginBottom: 15,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stockInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#2B78E4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '48%',
  },
  subscribeButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '48%',
    borderWidth: 1,
    borderColor: '#2B78E4',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subscribeText: {
    color: '#2B78E4',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  sizeButton: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: '#2B78E4',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedSizeText: {
    color: 'white',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 