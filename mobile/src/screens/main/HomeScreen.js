import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { UPLOADS_BASE_URL } from '../../config/api';
import { getLocalProductImage, HERO_IMAGE } from '../../constants/productImages';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌿', color: Colors.primary },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: Colors.dairy },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: Colors.vegetables },
  { id: 'fruits', name: 'Fruits', icon: '🍎', color: Colors.fruits },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: Colors.beverages },
  { id: 'snacks', name: 'Snacks', icon: '🥜', color: Colors.snacks },
];

const getCategoryEmoji = (category) => {
  const found = CATEGORIES.find(c => c.id === category);
  return found ? found.icon : '📦';
};

const getProductImageSource = (product) => {
  // 1. Try server image URL
  if (product?.images?.length) {
    const primary = product.images.find(img => img.isPrimary);
    const url = primary?.url || product.images[0]?.url;
    if (url) return { type: 'uri', source: { uri: `${UPLOADS_BASE_URL}${url}` } };
  }
  // 2. Fall back to local bundled image
  const local = getLocalProductImage(product);
  if (local) return { type: 'local', source: local };
  return null;
};

const formatCurrency = (amount) =>
  `${Math.round(amount || 0).toLocaleString('fr-SN')} FCFA`;

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { products, featuredProducts, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const displayFeatured = featuredProducts && featuredProducts.length > 0
    ? featuredProducts
    : (products || []).slice(0, 6);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        category: product.category,
      },
      quantity: 1,
    }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'Guest'} 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color={Colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Products')}
      >
        <Icon name="search" size={20} color={Colors.subText} />
        <Text style={styles.searchText}>Search for products...</Text>
      </TouchableOpacity>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoLabel}>Sénega'lait</Text>
          <Text style={styles.promoTitle}>100% lait de vache{'\n'}frais du terroir</Text>
          <TouchableOpacity style={styles.promoButton} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.promoButtonText}>Commander →</Text>
          </TouchableOpacity>
        </View>
        <Image source={HERO_IMAGE} style={styles.promoBannerImage} resizeMode="contain" />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => navigation.navigate('Products', { category: item.id })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.categoryEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ padding: 20 }} />
        ) : displayFeatured.length === 0 ? (
          <Text style={styles.emptyText}>No products available yet.</Text>
        ) : (
          <FlatList
            data={displayFeatured}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => {
              const img = getProductImageSource(item);
              return (
              <View style={styles.productCard}>
                <View style={styles.productImage}>
                  {img
                    ? <Image source={img.source} style={styles.productImageReal} resizeMode="cover" />
                    : <Text style={styles.productEmoji}>{getCategoryEmoji(item.category)}</Text>
                  }
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.productUnit}>{item.unit}</Text>
                  <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Icon name="plus" size={16} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: { fontSize: 16, color: Colors.subText },
  userName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  notificationButton: { position: 'relative', padding: 8 },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentPink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchText: { marginLeft: 12, fontSize: 16, color: Colors.subText },
  promoBanner: {
    backgroundColor: Colors.dark,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingLeft: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    overflow: 'hidden',
    minHeight: 130,
  },
  promoContent: { flex: 1, paddingRight: 8 },
  promoLabel: { fontSize: 11, color: Colors.primary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  promoTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.secondary, marginBottom: 14, lineHeight: 23 },
  promoButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoButtonText: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  promoBannerImage: {
    width: 110,
    height: 140,
    marginBottom: -20,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  seeAllText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  categoriesList: { paddingHorizontal: 20 },
  categoryItem: { alignItems: 'center', marginRight: 20, width: 70 },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: { fontSize: 22 },
  categoryName: { fontSize: 12, color: Colors.text, textAlign: 'center', fontWeight: '500' },
  productsList: { paddingHorizontal: 20 },
  productCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    width: 160,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productEmoji: { fontSize: 36 },
  productImageReal: { width: '100%', height: '100%', borderRadius: 8 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  productUnit: { fontSize: 12, color: Colors.subText, marginBottom: 6 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: Colors.primary },
  addToCartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { textAlign: 'center', color: Colors.subText, paddingHorizontal: 20, paddingVertical: 10 },
});

export default HomeScreen;
