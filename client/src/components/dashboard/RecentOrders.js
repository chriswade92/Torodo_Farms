import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { fetchOrders } from '../../store/slices/orderSlice';

const Container = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid #E0E0E0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: 18px;
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    svg {
      color: var(--primary);
    }
  }
`;

const ViewAllButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--primary);
    color: var(--secondary);
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background: #FAFAFA;
  transition: all var(--transition-fast);

  &:hover {
    background: #F5F5F5;
    transform: translateX(4px);
  }
`;

const OrderIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  flex-shrink: 0;

  svg {
    font-size: 18px;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderNumber = styled.h4`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin: 0 0 var(--spacing-xs) 0;
`;

const CustomerName = styled.p`
  font-size: 12px;
  color: var(--sub-text);
  margin: 0;
`;

const OrderDetails = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const OrderAmount = styled.div`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin-bottom: var(--spacing-xs);
`;

const OrderStatus = styled.div`
  font-size: 12px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background: ${props => {
    switch (props.status) {
      case 'pending': return 'rgba(247, 166, 85, 0.1)';
      case 'confirmed': return 'rgba(100, 207, 246, 0.1)';
      case 'processing': return 'rgba(130, 209, 115, 0.1)';
      case 'shipped': return 'rgba(169, 124, 255, 0.1)';
      case 'delivered': return 'rgba(130, 209, 115, 0.1)';
      case 'cancelled': return 'rgba(255, 94, 126, 0.1)';
      default: return 'rgba(136, 136, 136, 0.1)';
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
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--sub-text);

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return { icon: FiClock, color: 'var(--accent-orange)' };
    case 'confirmed':
      return { icon: FiCheckCircle, color: 'var(--primary)' };
    case 'processing':
      return { icon: FiCheckCircle, color: 'var(--accent-green)' };
    case 'shipped':
      return { icon: FiTruck, color: 'var(--accent-purple)' };
    case 'delivered':
      return { icon: FiCheckCircle, color: 'var(--accent-green)' };
    case 'cancelled':
      return { icon: FiClock, color: 'var(--accent-pink)' };
    default:
      return { icon: FiClock, color: 'var(--sub-text)' };
  }
};

const RecentOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector(state => state.orders);
  const recentOrders = orders ? orders.slice(0, 5) : [];

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (!recentOrders || recentOrders.length === 0) {
    return (
      <Container>
        <Header>
          <h3>
            <FiShoppingCart />
            Recent Orders
          </h3>
        </Header>
        <NoDataMessage>
          <p>No recent orders available.</p>
        </NoDataMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3>
          <FiShoppingCart />
          Recent Orders
        </h3>
        <ViewAllButton onClick={() => navigate('/orders')}>View All</ViewAllButton>
      </Header>

      <OrderList>
        {recentOrders.map((order) => {
          const { icon: StatusIcon, color } = getStatusIcon(order.status);
          const customerName = order.customer?.name || 'Unknown';

          return (
            <OrderItem key={order._id}>
              <OrderIcon color={color}>
                <StatusIcon />
              </OrderIcon>

              <OrderInfo>
                <OrderNumber>{order.orderNumber}</OrderNumber>
                <CustomerName>{customerName}</CustomerName>
              </OrderInfo>

              <OrderDetails>
                <OrderAmount>{formatCurrency(order.total)}</OrderAmount>
                <OrderStatus status={order.status}>{order.status}</OrderStatus>
              </OrderDetails>
            </OrderItem>
          );
        })}
      </OrderList>
    </Container>
  );
};

export default RecentOrders;
