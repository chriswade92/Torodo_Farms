import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiTrendingUp, FiUsers, FiPackage, FiCalendar } from 'react-icons/fi';
import SalesChart from '../dashboard/SalesChart';
import {
  fetchSalesData,
  fetchProductAnalytics,
  fetchCategoryAnalytics,
  fetchInventoryAnalytics,
  fetchCustomerAnalytics,
} from '../../store/slices/analyticsSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const Title = styled.h2`
  color: var(--text);
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const PeriodBtn = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border: 1px solid ${props => props.active ? 'var(--primary)' : '#E0E0E0'};
  background: ${props => props.active ? 'var(--primary)' : 'var(--secondary)'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--sub-text)'};
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary);
    color: ${props => props.active ? 'var(--secondary)' : 'var(--primary)'};
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid #E0E0E0;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin: 0 0 var(--spacing-lg) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  svg { color: var(--primary); }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--sub-text);
  text-transform: uppercase;
  border-bottom: 1px solid #E0E0E0;
`;

const Td = styled.td`
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  color: var(--text);
  border-bottom: 1px solid #F0F0F0;
  &:last-child { border-bottom: none; }
`;

const Tr = styled.tr`
  &:last-child td { border-bottom: none; }
  &:hover td { background: #FAFAFA; }
`;

const Rank = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.rank === 1 ? 'var(--accent-yellow)' : props.rank === 2 ? '#E0E0E0' : '#F5F5F5'};
  color: ${props => props.rank === 1 ? '#8B6914' : 'var(--sub-text)'};
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
`;

const EmptyMsg = styled.p`
  text-align: center;
  color: var(--sub-text);
  font-size: 14px;
  padding: var(--spacing-lg) 0;
`;

const PERIODS = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: '1 Year', value: '1y' },
];

const formatCurrency = (n) =>
  `${Math.round(n || 0).toLocaleString('fr-SN')} FCFA`;

const CATEGORY_COLORS = {
  dairy: 'rgba(100,207,246,0.7)',
  vegetables: 'rgba(130,209,115,0.7)',
  fruits: 'rgba(247,166,85,0.7)',
  beverages: 'rgba(169,124,255,0.7)',
  snacks: 'rgba(255,94,126,0.7)',
};

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { productAnalytics, categoryAnalytics, inventoryAnalytics, customerAnalytics } =
    useSelector(state => state.analytics);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    dispatch(fetchProductAnalytics());
    dispatch(fetchCategoryAnalytics());
    dispatch(fetchInventoryAnalytics());
    dispatch(fetchCustomerAnalytics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSalesData({ period }));
  }, [dispatch, period]);

  const categoryChartData = categoryAnalytics
    ? {
        labels: categoryAnalytics.map(c => c._id || c.category),
        datasets: [
          {
            label: 'Revenue (FCFA)',
            data: categoryAnalytics.map(c => c.totalRevenue || 0),
            backgroundColor: categoryAnalytics.map(c =>
              CATEGORY_COLORS[c._id] || CATEGORY_COLORS[c.category] || 'rgba(100,207,246,0.7)'
            ),
            borderRadius: 6,
          },
        ],
      }
    : null;

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => formatCurrency(ctx.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F0F0F0' },
        ticks: {
          callback: val => `${(val / 1000).toFixed(0)}k FCFA`,
        },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Analytics</Title>
        <PeriodSelector>
          {PERIODS.map(p => (
            <PeriodBtn key={p.value} active={period === p.value} onClick={() => setPeriod(p.value)}>
              <FiCalendar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {p.label}
            </PeriodBtn>
          ))}
        </PeriodSelector>
      </PageHeader>

      {/* Sales Chart (reuses existing component) */}
      <SalesChart />

      <TwoCol>
        {/* Category Performance */}
        <Card>
          <CardTitle><FiTrendingUp /> Revenue by Category</CardTitle>
          {categoryChartData ? (
            <Bar data={categoryChartData} options={categoryChartOptions} />
          ) : (
            <EmptyMsg>No category data available.</EmptyMsg>
          )}
        </Card>

        {/* Top Products */}
        <Card>
          <CardTitle><FiPackage /> Top Products by Revenue</CardTitle>
          {productAnalytics && productAnalytics.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Product</Th>
                  <Th>Sold</Th>
                  <Th>Revenue</Th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.slice(0, 8).map((p, i) => (
                  <Tr key={p._id}>
                    <Td><Rank rank={i + 1}>{i + 1}</Rank></Td>
                    <Td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--sub-text)', textTransform: 'capitalize' }}>{p.category}</div>
                    </Td>
                    <Td>{p.totalSold || 0} units</Td>
                    <Td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(p.totalRevenue)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyMsg>No product data available.</EmptyMsg>
          )}
        </Card>
      </TwoCol>

      <TwoCol>
        {/* Top Customers */}
        <Card>
          <CardTitle><FiUsers /> Top Customers by Spending</CardTitle>
          {customerAnalytics && customerAnalytics.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Customer</Th>
                  <Th>Orders</Th>
                  <Th>Total Spent</Th>
                </tr>
              </thead>
              <tbody>
                {customerAnalytics.slice(0, 8).map((c, i) => (
                  <Tr key={c._id}>
                    <Td><Rank rank={i + 1}>{i + 1}</Rank></Td>
                    <Td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--sub-text)' }}>{c.email}</div>
                    </Td>
                    <Td>{c.totalOrders || 0}</Td>
                    <Td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(c.totalSpent)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyMsg>No customer data available.</EmptyMsg>
          )}
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardTitle><FiPackage /> Inventory by Category</CardTitle>
          {inventoryAnalytics && inventoryAnalytics.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Category</Th>
                  <Th>Products</Th>
                  <Th>In Stock</Th>
                  <Th>Low / Out</Th>
                </tr>
              </thead>
              <tbody>
                {inventoryAnalytics.map((cat, i) => (
                  <Tr key={i}>
                    <Td style={{ textTransform: 'capitalize', fontWeight: 'var(--font-weight-semibold)' }}>
                      {cat._id || cat.category}
                    </Td>
                    <Td>{cat.totalProducts || 0}</Td>
                    <Td style={{ color: 'var(--accent-green)' }}>{cat.totalStock || 0}</Td>
                    <Td>
                      <span style={{ color: 'var(--accent-orange)', marginRight: '6px' }}>
                        {cat.lowStock || 0}
                      </span>
                      /
                      <span style={{ color: 'var(--accent-pink)', marginLeft: '6px' }}>
                        {cat.outOfStock || 0}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyMsg>No inventory data available.</EmptyMsg>
          )}
        </Card>
      </TwoCol>
    </PageContainer>
  );
};

export default AnalyticsPage;
