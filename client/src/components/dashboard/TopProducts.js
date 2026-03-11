import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiPackage, FiTrendingUp } from 'react-icons/fi';

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
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 18px;
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0;
  }
  
  svg {
    color: var(--primary);
    font-size: 20px;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ProductItem = styled.div`
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

const ProductImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-sm);
  background: ${props => props.color || 'var(--primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  font-weight: var(--font-weight-semibold);
  font-size: 16px;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
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

const ProductCategory = styled.p`
  font-size: 12px;
  color: var(--sub-text);
  margin: 0;
  text-transform: capitalize;
`;

const ProductStats = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const Revenue = styled.div`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--text);
  margin-bottom: var(--spacing-xs);
`;

const SalesCount = styled.div`
  font-size: 12px;
  color: var(--sub-text);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  
  svg {
    color: var(--accent-green);
  }
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

const formatCurrency = (amount) =>
  `${Math.round(amount || 0).toLocaleString('fr-SN')} FCFA`;

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-NG').format(num || 0);
};

const getCategoryColor = (category) => {
  const colors = {
    dairy: 'var(--primary)',
    vegetables: 'var(--accent-green)',
    fruits: 'var(--accent-orange)',
    beverages: 'var(--accent-purple)',
    snacks: 'var(--accent-yellow)',
  };
  return colors[category] || 'var(--primary)';
};

const getCategoryIcon = (category) => {
  const icons = {
    dairy: '🥛',
    vegetables: '🥬',
    fruits: '🍎',
    beverages: '🥤',
    snacks: '🥜',
  };
  return icons[category] || '📦';
};

const TopProducts = () => {
  const { productAnalytics } = useSelector(state => state.analytics);

  if (!productAnalytics || productAnalytics.length === 0) {
    return (
      <Container>
        <Header>
          <FiPackage />
          <h3>Top Products</h3>
        </Header>
        <NoDataMessage>
          <p>No product data available.</p>
        </NoDataMessage>
      </Container>
    );
  }

  const topProducts = productAnalytics.slice(0, 5);

  return (
    <Container>
      <Header>
        <FiPackage />
        <h3>Top Products</h3>
      </Header>
      
      <ProductList>
        {topProducts.map((product, index) => (
          <ProductItem key={product._id}>
            <ProductImage color={getCategoryColor(product.category)}>
              {getCategoryIcon(product.category)}
            </ProductImage>
            
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductCategory>{product.category}</ProductCategory>
            </ProductInfo>
            
            <ProductStats>
              <Revenue>{formatCurrency(product.totalRevenue)}</Revenue>
              <SalesCount>
                <FiTrendingUp />
                {formatNumber(product.totalSold)} sold
              </SalesCount>
            </ProductStats>
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
};

export default TopProducts; 