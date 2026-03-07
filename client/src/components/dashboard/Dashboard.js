import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';
import {
  fetchDashboardStats,
  fetchSalesData,
  fetchProductAnalytics,
  fetchCategoryAnalytics,
  fetchInventoryAnalytics,
  fetchCustomerAnalytics
} from '../../store/slices/analyticsSlice';
import StatsCard from './StatsCard';
import SalesChart from './SalesChart';
import TopProducts from './TopProducts';
import RecentOrders from './RecentOrders';
import InventoryAlerts from './InventoryAlerts';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const WelcomeMessage = styled.div`
  h2 {
    color: var(--text);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--sub-text);
    margin: 0;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: #5BB8E0;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 94, 126, 0.1);
  color: var(--accent-pink);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 94, 126, 0.2);
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xxl);
  
  .spinner {
    width: 40px;
    height: 40px;
  }
`;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    dashboardStats, 
    loading, 
    error 
  } = useSelector(state => state.analytics);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchDashboardStats()),
        dispatch(fetchSalesData()),
        dispatch(fetchProductAnalytics()),
        dispatch(fetchCategoryAnalytics()),
        dispatch(fetchInventoryAnalytics()),
        dispatch(fetchCustomerAnalytics())
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NG').format(num || 0);
  };

  if (loading && !dashboardStats) {
    return (
      <LoadingSpinner>
        <div className="spinner"></div>
      </LoadingSpinner>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeMessage>
          <h2>Welcome back, {user?.name || 'Admin'}! 👋</h2>
          <p>Here's what's happening with your business today.</p>
        </WelcomeMessage>
        
        <RefreshButton 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? 'spinner' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </Header>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {dashboardStats && (
        <StatsGrid>
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.revenue?.total)}
            change={dashboardStats.revenue?.today}
            changeLabel="Today"
            icon={FiDollarSign}
            color="var(--primary)"
            trend="up"
          />
          
          <StatsCard
            title="Total Orders"
            value={formatNumber(dashboardStats.orders?.total)}
            change={dashboardStats.orders?.today}
            changeLabel="Today"
            icon={FiShoppingCart}
            color="var(--accent-green)"
            trend="up"
          />
          
          <StatsCard
            title="Total Customers"
            value={formatNumber(dashboardStats.customers?.total)}
            change={dashboardStats.customers?.today}
            changeLabel="Today"
            icon={FiUsers}
            color="var(--accent-purple)"
            trend="up"
          />
          
          <StatsCard
            title="Low Stock Items"
            value={formatNumber(dashboardStats.inventory?.lowStock)}
            change={dashboardStats.inventory?.outOfStock}
            changeLabel="Out of Stock"
            icon={FiAlertTriangle}
            color="var(--accent-orange)"
            trend="down"
          />
        </StatsGrid>
      )}

      <ChartsSection>
        <SalesChart />
        <TopProducts />
      </ChartsSection>

      <BottomSection>
        <RecentOrders />
        <InventoryAlerts />
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard; 