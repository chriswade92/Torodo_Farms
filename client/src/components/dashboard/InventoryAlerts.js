import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiAlertTriangle, FiPackage } from 'react-icons/fi';

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
      color: var(--accent-orange);
    }
  }
`;

const AlertCount = styled.div`
  background: var(--accent-orange);
  color: var(--secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background: ${props => props.severity === 'critical' ? 'rgba(255, 94, 126, 0.1)' : 'rgba(247, 166, 85, 0.1)'};
  border: 1px solid ${props => props.severity === 'critical' ? 'rgba(255, 94, 126, 0.2)' : 'rgba(247, 166, 85, 0.2)'};
  transition: all var(--transition-fast);

  &:hover {
    transform: translateX(4px);
  }
`;

const AlertIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.severity === 'critical' ? 'var(--accent-pink)' : 'var(--accent-orange)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  flex-shrink: 0;

  svg {
    font-size: 18px;
  }
`;

const AlertInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.h4`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin: 0 0 var(--spacing-xs) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlertMessage = styled.p`
  font-size: 12px;
  color: var(--sub-text);
  margin: 0;
`;

const StockInfo = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const StockLevel = styled.div`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: ${props => props.severity === 'critical' ? 'var(--accent-pink)' : 'var(--accent-orange)'};
  margin-bottom: var(--spacing-xs);
`;

const StockStatus = styled.div`
  font-size: 12px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background: ${props => props.severity === 'critical' ? 'rgba(255, 94, 126, 0.1)' : 'rgba(247, 166, 85, 0.1)'};
  color: ${props => props.severity === 'critical' ? 'var(--accent-pink)' : 'var(--accent-orange)'};
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
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

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-NG').format(num || 0);
};

const InventoryAlerts = () => {
  const { inventoryAnalytics } = useSelector(state => state.analytics);

  // Build alert list from inventory analytics data
  const alerts = inventoryAnalytics
    ? inventoryAnalytics
        .flatMap(cat => cat.products || [])
        .filter(p => p.quantity <= p.lowStockThreshold)
        .map(p => ({
          id: p._id,
          name: p.name,
          category: p.category,
          currentStock: p.quantity,
          threshold: p.lowStockThreshold,
          severity: p.quantity === 0 ? 'critical' : 'warning',
        }))
    : [];

  if (!alerts || alerts.length === 0) {
    return (
      <Container>
        <Header>
          <h3>
            <FiAlertTriangle />
            Inventory Alerts
          </h3>
          <AlertCount>0</AlertCount>
        </Header>
        <NoDataMessage>
          <p>No inventory alerts at the moment.</p>
        </NoDataMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3>
          <FiAlertTriangle />
          Inventory Alerts
        </h3>
        <AlertCount>{alerts.length}</AlertCount>
      </Header>

      <AlertList>
        {alerts.slice(0, 5).map((alert) => (
          <AlertItem key={alert.id} severity={alert.severity}>
            <AlertIcon severity={alert.severity}>
              <FiPackage />
            </AlertIcon>

            <AlertInfo>
              <ProductName>{alert.name}</ProductName>
              <AlertMessage>
                {alert.severity === 'critical'
                  ? 'Out of stock'
                  : `Low stock — ${formatNumber(alert.currentStock)} remaining`
                }
              </AlertMessage>
            </AlertInfo>

            <StockInfo>
              <StockLevel severity={alert.severity}>
                {formatNumber(alert.currentStock)} / {formatNumber(alert.threshold)}
              </StockLevel>
              <StockStatus severity={alert.severity}>
                {alert.severity === 'critical' ? 'Out of Stock' : 'Low Stock'}
              </StockStatus>
            </StockInfo>
          </AlertItem>
        ))}
      </AlertList>
    </Container>
  );
};

export default InventoryAlerts;
