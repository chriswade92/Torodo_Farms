import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import { fetchOrders } from '../../store/slices/orderSlice';

const STATUS_COLORS = {
  pending: Colors.accentOrange,
  confirmed: Colors.primary,
  processing: Colors.accentGreen,
  shipped: Colors.accentPurple,
  delivered: Colors.accentGreen,
  cancelled: Colors.accentPink,
};

const STATUS_ICONS = {
  pending: 'clock',
  confirmed: 'check-circle',
  processing: 'loader',
  shipped: 'truck',
  delivered: 'check-circle',
  cancelled: 'x-circle',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount || 0);

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  const [expandedId, setExpandedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchOrders());
    setRefreshing(false);
  };

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const renderOrder = ({ item }) => {
    const isExpanded = expandedId === item._id;
    const statusColor = STATUS_COLORS[item.status] || Colors.subText;
    const statusIcon = STATUS_ICONS[item.status] || 'circle';

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => toggleExpand(item._id)}
        activeOpacity={0.85}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={[styles.statusIconBox, { backgroundColor: statusColor + '20' }]}>
            <Icon name={statusIcon} size={20} color={statusColor} />
          </View>
          <View style={styles.orderMeta}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.orderRight}>
            <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
              </Text>
            </View>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.subText}
            style={{ marginLeft: 8 }}
          />
        </View>

        {/* Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>
            {item.items?.length || 0} item{(item.items?.length || 0) !== 1 ? 's' : ''} ·{' '}
            {item.paymentMethod?.replace(/_/g, ' ')}
          </Text>
        </View>

        {/* Expanded Detail */}
        {isExpanded && (
          <View style={styles.orderDetail}>
            <View style={styles.detailDivider} />

            <Text style={styles.detailSectionTitle}>Items</Text>
            {(item.items || []).map((lineItem, i) => (
              <View key={i} style={styles.lineItem}>
                <Text style={styles.lineItemName} numberOfLines={1}>
                  {lineItem.name} × {lineItem.quantity} {lineItem.unit}
                </Text>
                <Text style={styles.lineItemTotal}>{formatCurrency(lineItem.total)}</Text>
              </View>
            ))}

            <View style={styles.detailDivider} />

            <Text style={styles.detailSectionTitle}>Delivery Address</Text>
            <Text style={styles.addressLine}>{item.shippingAddress?.street}</Text>
            <Text style={styles.addressLine}>
              {item.shippingAddress?.city}, {item.shippingAddress?.state}
            </Text>
            <Text style={styles.addressLine}>{item.shippingAddress?.phone}</Text>

            {item.timeline && item.timeline.length > 0 && (
              <>
                <View style={styles.detailDivider} />
                <Text style={styles.detailSectionTitle}>Status History</Text>
                {item.timeline.map((t, i) => (
                  <View key={i} style={styles.timelineRow}>
                    <View style={[styles.timelineDot, { backgroundColor: STATUS_COLORS[t.status] || Colors.subText }]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStatus}>
                        {t.status?.charAt(0).toUpperCase() + t.status?.slice(1)}
                        {t.note ? ` — ${t.note}` : ''}
                      </Text>
                      <Text style={styles.timelineDate}>
                        {new Date(t.timestamp).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !orders?.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders || []}
        keyExtractor={item => item._id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Your orders will appear here once you place one</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  orderCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: { flexDirection: 'row', alignItems: 'center' },
  statusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  orderMeta: { flex: 1 },
  orderNumber: { fontSize: 14, fontWeight: '600', color: Colors.text },
  orderDate: { fontSize: 12, color: Colors.subText, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', marginRight: 6 },
  orderTotal: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  orderSummary: { marginTop: 8 },
  summaryText: { fontSize: 12, color: Colors.subText, textTransform: 'capitalize' },
  orderDetail: { marginTop: 4 },
  detailDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 10 },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.subText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  lineItemName: { fontSize: 13, color: Colors.text, flex: 1, marginRight: 8 },
  lineItemTotal: { fontSize: 13, fontWeight: '500', color: Colors.text },
  addressLine: { fontSize: 13, color: Colors.text, marginBottom: 3 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  timelineContent: {},
  timelineStatus: { fontSize: 13, color: Colors.text, textTransform: 'capitalize' },
  timelineDate: { fontSize: 11, color: Colors.subText, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.subText, textAlign: 'center', paddingHorizontal: 40 },
});

export default OrdersScreen;
