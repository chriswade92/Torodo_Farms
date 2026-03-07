import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/orderSlice';

const DELIVERY_FEE = 500;

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount || 0);

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);

  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    phone: user?.phone || '',
    instructions: '',
  });
  const [addressErrors, setAddressErrors] = useState({});

  const validateAddress = () => {
    const errs = {};
    if (!address.street.trim()) errs.street = 'Street address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'State is required';
    if (!address.phone.trim()) errs.phone = 'Phone number is required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    const orderItems = items.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      total: item.price * item.quantity,
    }));

    const orderData = {
      items: orderItems,
      subtotal: total,
      shipping: DELIVERY_FEE,
      total: total + DELIVERY_FEE,
      paymentMethod: 'cash_on_delivery',
      shippingAddress: {
        street: address.street,
        city: address.city,
        state: address.state,
        country: 'Nigeria',
        phone: address.phone,
        instructions: address.instructions,
      },
      delivery: { method: 'standard' },
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      Alert.alert(
        'Order Placed!',
        'Your order has been placed successfully. Pay on delivery.',
        [{ text: 'View Orders', onPress: () => navigation.navigate('Orders') }]
      );
    } catch (error) {
      Alert.alert('Order Failed', error || 'Something went wrong. Please try again.');
    }
  };

  const updateAddr = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (addressErrors[field]) setAddressErrors(prev => ({ ...prev, [field]: null }));
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some fresh products to get started</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cart Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cart Items ({items.length})</Text>
        {items.map(item => (
          <View key={item._id} style={styles.cartItem}>
            <View style={styles.itemEmoji}>
              <Text style={styles.emojiText}>
                {item.category === 'dairy' ? '🥛' : item.category === 'vegetables' ? '🥬' : '📦'}
              </Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)} / {item.unit}</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity - 1 }))}
              >
                <Icon name="minus" size={14} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity + 1 }))}
              >
                <Icon name="plus" size={14} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</Text>
              <TouchableOpacity
                onPress={() => dispatch(removeFromCart(item._id))}
                style={styles.removeBtn}
              >
                <Icon name="trash-2" size={16} color={Colors.accentPink} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatCurrency(DELIVERY_FEE)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total + DELIVERY_FEE)}</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Icon name="truck" size={16} color={Colors.accentGreen} />
            <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
          </View>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.addressToggle}
          onPress={() => setShowAddress(!showAddress)}
        >
          <View style={styles.addressToggleLeft}>
            <Icon name="map-pin" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Icon name={showAddress ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.subText} />
        </TouchableOpacity>

        {showAddress && (
          <View style={styles.addressForm}>
            <View style={[styles.inputRow, addressErrors.street && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Street address"
                placeholderTextColor={Colors.subText}
                value={address.street}
                onChangeText={v => updateAddr('street', v)}
              />
            </View>
            {addressErrors.street ? <Text style={styles.errorText}>{addressErrors.street}</Text> : null}

            <View style={styles.twoCol}>
              <View style={[styles.inputRow, styles.halfInput, addressErrors.city && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={Colors.subText}
                  value={address.city}
                  onChangeText={v => updateAddr('city', v)}
                />
              </View>
              <View style={[styles.inputRow, styles.halfInput, addressErrors.state && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor={Colors.subText}
                  value={address.state}
                  onChangeText={v => updateAddr('state', v)}
                />
              </View>
            </View>
            {(addressErrors.city || addressErrors.state) ? (
              <Text style={styles.errorText}>{addressErrors.city || addressErrors.state}</Text>
            ) : null}

            <View style={[styles.inputRow, addressErrors.phone && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={Colors.subText}
                value={address.phone}
                onChangeText={v => updateAddr('phone', v)}
                keyboardType="phone-pad"
              />
            </View>
            {addressErrors.phone ? <Text style={styles.errorText}>{addressErrors.phone}</Text> : null}

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Delivery instructions (optional)"
                placeholderTextColor={Colors.subText}
                value={address.instructions}
                onChangeText={v => updateAddr('instructions', v)}
              />
            </View>
          </View>
        )}
      </View>

      {/* Place Order */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.orderButton, loading && styles.orderButtonDisabled]}
          onPress={() => {
            if (!showAddress) {
              setShowAddress(true);
              return;
            }
            handlePlaceOrder();
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.secondary} />
          ) : (
            <>
              <Icon name="check-circle" size={20} color={Colors.secondary} />
              <Text style={styles.orderButtonText}>
                {showAddress ? `Place Order · ${formatCurrency(total + DELIVERY_FEE)}` : 'Enter Delivery Address'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: Colors.subText, textAlign: 'center', marginBottom: 28 },
  shopButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  shopButtonText: { color: Colors.secondary, fontSize: 16, fontWeight: '600' },
  section: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 10,
  },
  itemEmoji: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  itemPrice: { fontSize: 12, color: Colors.subText, marginTop: 2 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyText: { fontSize: 14, fontWeight: '600', color: Colors.text, minWidth: 20, textAlign: 'center' },
  itemRight: { alignItems: 'flex-end', gap: 4 },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  removeBtn: { padding: 4 },
  summaryCard: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: Colors.subText },
  summaryValue: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.accentGreen + '15',
    borderRadius: 8,
    padding: 10,
  },
  paymentMethodText: { fontSize: 14, color: Colors.accentGreen, fontWeight: '500' },
  addressToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  addressToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressForm: { marginTop: 12, gap: 8 },
  twoCol: { flexDirection: 'row', gap: 8 },
  halfInput: { flex: 1 },
  inputRow: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
  },
  inputError: { borderColor: Colors.error },
  input: { fontSize: 14, color: Colors.text },
  errorText: { fontSize: 12, color: Colors.error, marginTop: -4 },
  footer: { padding: 16, paddingBottom: 32 },
  orderButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  orderButtonDisabled: { opacity: 0.6 },
  orderButtonText: { color: Colors.secondary, fontSize: 16, fontWeight: '600' },
});

export default CartScreen;
