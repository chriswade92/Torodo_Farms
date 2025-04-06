import { StyleSheet, ScrollView, Image, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCart } from '@/hooks/useCart';

type ProductSize = '1L' | '10L';

interface Product {
  id: number;
  name: string;
  prices: Record<ProductSize, string>;
  image: string;
  description: string;
  sizes: ProductSize[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Fresh Milk',
    prices: {
      '1L': 'CFA 1000',
      '10L': 'CFA 8000'
    },
    image: 'https://www.dairyfarmers.ca/sites/default/files/styles/header_image_1025_x_400_/public/header-images/AdobeStock_279692163_1.jpeg?itok=G2sjbwaY',
    description: 'Fresh, pure cow milk delivered daily. Rich in calcium and protein. Perfect for your daily nutrition.',
    sizes: ['1L', '10L'],
  },
  {
    id: 2,
    name: 'Lait Caillé (Soow)',
    prices: {
      '1L': 'CFA 1000',
      '10L': 'CFA 8000'
    },
    image: 'https://static.toiimg.com/thumb/msid-98787812,width-1280,height-720,resizemode-4/98787812.jpg',
    description: 'Traditional fermented milk (Soow). Probiotic-rich and naturally cultured. A healthy choice for your diet.',
    sizes: ['1L', '10L'],
  }
];

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { cart, addToCart } = useCart();

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    if (!quantities[productId]) {
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
    }
  };

  const updateQuantity = (productId: number, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + (increment ? 1 : -1))
    }));
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id];
    const quantity = quantities[product.id] || 1;
    
    if (!size) {
      Alert.alert('Selection Required', 'Please select a size before adding to cart');
      return;
    }

    addToCart(product.id, product.name, size, quantity);
    
    // Show success message
    Alert.alert(
      'Added to Cart',
      `${quantity} × ${product.name} (${size}) has been added to your cart`,
      [{ text: 'OK' }]
    );

    // Reset selection after adding to cart
    setSelectedSizes(prev => ({ ...prev, [product.id]: '' }));
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Our Products
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Fresh dairy products delivered to your doorstep
        </ThemedText>
        {cart.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.length}</Text>
          </View>
        )}
      </ThemedView>

      <View style={styles.productsContainer}>
        {products.map((product) => (
          <ThemedView key={product.id} style={styles.productCard}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage}
              resizeMode="cover"
            />
            <ThemedView style={styles.productInfo}>
              <ThemedText style={styles.productName}>{product.name}</ThemedText>
              
              <ThemedView style={styles.sizesContainer}>
                <ThemedText style={styles.sizesTitle}>Select Size:</ThemedText>
                <View style={styles.sizeButtons}>
                  {product.sizes.map((size) => (
                    <TouchableOpacity 
                      key={size} 
                      style={[
                        styles.sizeButton,
                        selectedSizes[product.id] === size && styles.selectedSizeButton
                      ]}
                      onPress={() => handleSizeSelect(product.id, size)}
                    >
                      <Text style={[
                        styles.sizeButtonText,
                        selectedSizes[product.id] === size && styles.selectedSizeText
                      ]}>{size}</Text>
                      <Text style={[
                        styles.priceText,
                        selectedSizes[product.id] === size && styles.selectedPriceText
                      ]}>{product.prices[size]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ThemedView>

              {selectedSizes[product.id] && (
                <ThemedView style={styles.quantityContainer}>
                  <ThemedText style={styles.quantityTitle}>Quantity:</ThemedText>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, false)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantities[product.id] || 1}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, true)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </ThemedView>
              )}

              <ThemedText style={styles.productDescription}>
                {product.description}
              </ThemedText>

              <TouchableOpacity 
                style={[
                  styles.addToCartButton,
                  !selectedSizes[product.id] && styles.disabledButton
                ]}
                onPress={() => handleAddToCart(product)}
                disabled={!selectedSizes[product.id]}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  cartBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#2ecc71',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sizesContainer: {
    marginBottom: 16,
  },
  sizesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  sizeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedSizeText: {
    color: '#fff',
  },
  priceText: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  selectedPriceText: {
    color: '#fff',
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 