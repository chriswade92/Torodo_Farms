import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import { fetchProducts, fetchProductsByCategory } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { UPLOADS_BASE_URL } from '../../config/api';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌿' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'snacks', name: 'Snacks', icon: '🥜' },
];

const CATEGORY_ICONS = {
  dairy: '🥛', vegetables: '🥬', fruits: '🍎',
  beverages: '🥤', snacks: '🥜',
};

const getProductImageUrl = (product) => {
  if (!product?.images?.length) return null;
  const primary = product.images.find(img => img.isPrimary);
  const url = primary?.url || product.images[0]?.url;
  if (!url) return null;
  return `${UPLOADS_BASE_URL}${url}`;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount || 0);

const ProductsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || 'all');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (selectedCategory === 'all') {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  const filtered = (products || []).filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

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
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const renderProduct = ({ item }) => {
    const isAdded = addedId === item._id;
    const imgUrl = getProductImageUrl(item);
    return (
      <View style={styles.productCard}>
        <View style={styles.productImageBox}>
          {imgUrl
            ? <Image source={{ uri: imgUrl }} style={styles.productImageReal} resizeMode="cover" />
            : <Text style={styles.productEmoji}>{CATEGORY_ICONS[item.category] || '📦'}</Text>
          }
          {item.inventory?.quantity === 0 && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productUnit}>{item.unit} · {item.category}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            <TouchableOpacity
              style={[styles.addBtn, isAdded && styles.addBtnAdded]}
              onPress={() => handleAddToCart(item)}
              disabled={item.inventory?.quantity === 0}
            >
              <Icon name={isAdded ? 'check' : 'plus'} size={14} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={Colors.subText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.subText}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="x" size={16} color={Colors.subText} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === item.id && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text style={styles.categoryChipIcon}>{item.icon}</Text>
            <Text style={[styles.categoryChipText, selectedCategory === item.id && styles.categoryChipTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>Try a different category or search term</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={renderProduct}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  categoryList: { paddingHorizontal: 16, paddingVertical: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondary,
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryChipIcon: { fontSize: 14 },
  categoryChipText: { fontSize: 13, color: Colors.subText, fontWeight: '500' },
  categoryChipTextActive: { color: Colors.secondary },
  productGrid: { paddingHorizontal: 12, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  productCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageBox: {
    height: 90,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  productEmoji: { fontSize: 36 },
  productImageReal: { width: '100%', height: '100%', borderRadius: 8 },
  outOfStockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  outOfStockText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  productInfo: {},
  productName: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 3 },
  productUnit: { fontSize: 11, color: Colors.subText, marginBottom: 8, textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnAdded: { backgroundColor: Colors.accentGreen },
  loader: { flex: 1, justifyContent: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.subText, textAlign: 'center' },
});

export default ProductsScreen;
