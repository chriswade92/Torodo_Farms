import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiShoppingBag, FiChevronDown, FiChevronUp, FiMapPin, FiClock } from 'react-icons/fi';
import { fetchOrders, updateOrderStatus } from '../../store/slices/orderSlice';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: var(--text);
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 20px;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid ${props => props.active ? 'var(--primary)' : '#E0E0E0'};
  background: ${props => props.active ? 'var(--primary)' : 'var(--secondary)'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--sub-text)'};

  &:hover {
    border-color: var(--primary);
    color: ${props => props.active ? 'var(--secondary)' : 'var(--primary)'};
  }
`;

const TableCard = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid #E0E0E0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--sub-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #FAFAFA;
  border-bottom: 1px solid #E0E0E0;
`;

const Td = styled.td`
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 14px;
  color: var(--text);
  border-bottom: 1px solid #F0F0F0;
  vertical-align: middle;
`;

const Tr = styled.tr`
  cursor: pointer;
  &:last-child td { border-bottom: none; }
  &:hover td { background: #FAFAFA; }
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
  background: ${props => {
    switch (props.status) {
      case 'pending': return 'rgba(247,166,85,0.15)';
      case 'confirmed': return 'rgba(100,207,246,0.15)';
      case 'processing': return 'rgba(130,209,115,0.15)';
      case 'shipped': return 'rgba(169,124,255,0.15)';
      case 'delivered': return 'rgba(130,209,115,0.15)';
      case 'cancelled': return 'rgba(255,94,126,0.15)';
      default: return 'rgba(136,136,136,0.15)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return 'var(--accent-orange)';
      case 'confirmed': return 'var(--primary)';
      case 'processing': return 'var(--accent-green)';
      case 'shipped': return 'var(--accent-purple)';
      case 'delivered': return 'var(--accent-green)';
      case 'cancelled': return 'var(--accent-pink)';
      default: return 'var(--sub-text)';
    }
  }};
`;

const StatusSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #E0E0E0;
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  color: var(--text);
  background: var(--secondary);
  cursor: pointer;
  outline: none;
  &:focus { border-color: var(--primary); }
`;

const ExpandRow = styled.tr`
  background: #F7FCFE;
`;

const ExpandTd = styled.td`
  padding: var(--spacing-lg);
  border-bottom: 1px solid #E0E0E0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const DetailSection = styled.div`
  h4 {
    font-size: 13px;
    font-weight: var(--font-weight-semibold);
    color: var(--sub-text);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 var(--spacing-md) 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text);
  padding: 4px 0;
  border-bottom: 1px solid #F0F0F0;

  &:last-child { border-bottom: none; }
`;

const AddressLine = styled.p`
  font-size: 13px;
  color: var(--text);
  margin: 0 0 4px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  font-size: 13px;
  color: var(--text);
  padding: 4px 0;

  span:first-child {
    color: var(--sub-text);
    min-width: 140px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xxl);
  color: var(--sub-text);

  svg { font-size: 48px; margin-bottom: var(--spacing-md); color: #D0D0D0; }
  p { margin: 0; font-size: 14px; }
`;

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const FILTER_TABS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatCurrency = (n) =>
  `${Math.round(n || 0).toLocaleString('fr-SN')} FCFA`;

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filtered = orders
    ? (activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter))
    : [];

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const handleStatusChange = (e, orderId) => {
    e.stopPropagation();
    dispatch(updateOrderStatus({ orderId, status: e.target.value }));
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Orders</Title>
      </PageHeader>

      <FilterTabs>
        {FILTER_TABS.map(tab => (
          <FilterTab
            key={tab}
            active={activeFilter === tab}
            onClick={() => setActiveFilter(tab)}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </FilterTab>
        ))}
      </FilterTabs>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Order #</Th>
              <Th>Customer</Th>
              <Th>Total</Th>
              <Th>Payment</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Update Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>Loading...</Td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState>
                    <FiShoppingBag />
                    <p>No orders found.</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filtered.map(order => (
                <React.Fragment key={order._id}>
                  <Tr onClick={() => toggleExpand(order._id)}>
                    <Td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.orderNumber}</Td>
                    <Td>
                      <div>{order.customer?.name || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--sub-text)' }}>{order.customer?.phone || ''}</div>
                    </Td>
                    <Td>{formatCurrency(order.total)}</Td>
                    <Td style={{ textTransform: 'capitalize', fontSize: '13px' }}>
                      {order.paymentMethod?.replace(/_/g, ' ')}
                    </Td>
                    <Td><StatusBadge status={order.status}>{order.status}</StatusBadge></Td>
                    <Td style={{ fontSize: '13px', color: 'var(--sub-text)' }}>{formatDate(order.createdAt)}</Td>
                    <Td onClick={e => e.stopPropagation()}>
                      <StatusSelect
                        value={order.status}
                        onChange={e => handleStatusChange(e, order._id)}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </StatusSelect>
                    </Td>
                    <Td>
                      {expandedId === order._id ? <FiChevronUp /> : <FiChevronDown />}
                    </Td>
                  </Tr>

                  {expandedId === order._id && (
                    <ExpandRow>
                      <ExpandTd colSpan={8}>
                        <DetailGrid>
                          <DetailSection>
                            <h4>Order Items</h4>
                            {(order.items || []).map((item, i) => (
                              <ItemRow key={i}>
                                <span>{item.name} × {item.quantity} {item.unit}</span>
                                <span>{formatCurrency(item.total)}</span>
                              </ItemRow>
                            ))}
                            <ItemRow style={{ fontWeight: 'var(--font-weight-semibold)', marginTop: '4px' }}>
                              <span>Total</span>
                              <span>{formatCurrency(order.total)}</span>
                            </ItemRow>
                          </DetailSection>

                          <div>
                            <DetailSection>
                              <h4><FiMapPin /> Shipping Address</h4>
                              <AddressLine>{order.shippingAddress?.street}</AddressLine>
                              <AddressLine>{order.shippingAddress?.city}, {order.shippingAddress?.state}</AddressLine>
                              <AddressLine>{order.shippingAddress?.country}</AddressLine>
                              <AddressLine>{order.shippingAddress?.phone}</AddressLine>
                            </DetailSection>

                            {order.timeline && order.timeline.length > 0 && (
                              <DetailSection style={{ marginTop: 'var(--spacing-lg)' }}>
                                <h4><FiClock /> Timeline</h4>
                                {order.timeline.map((t, i) => (
                                  <TimelineItem key={i}>
                                    <span>{new Date(t.timestamp).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                    <span style={{ textTransform: 'capitalize' }}>{t.status} {t.note ? `— ${t.note}` : ''}</span>
                                  </TimelineItem>
                                ))}
                              </DetailSection>
                            )}
                          </div>
                        </DetailGrid>
                      </ExpandTd>
                    </ExpandRow>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>
    </PageContainer>
  );
};

export default OrdersPage;
