import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Card = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  border: 1px solid #E0E0E0;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  
  svg {
    font-size: 24px;
  }
`;

const CardContent = styled.div`
  flex: 1;
  margin-left: var(--spacing-md);
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--sub-text);
  margin: 0 0 var(--spacing-xs) 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--text);
  margin-bottom: var(--spacing-sm);
  line-height: 1.2;
`;

const ChangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const ChangeValue = styled.span`
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: ${props => props.trend === 'up' ? 'var(--accent-green)' : 'var(--accent-pink)'};
`;

const ChangeLabel = styled.span`
  font-size: 12px;
  color: var(--sub-text);
`;

const TrendIcon = styled.div`
  color: ${props => props.trend === 'up' ? 'var(--accent-green)' : 'var(--accent-pink)'};
  
  svg {
    font-size: 16px;
  }
`;

const formatCurrency = (amount) => {
  if (!amount) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-NG').format(num);
};

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon, 
  color, 
  trend = 'up',
  valueType = 'number'
}) => {
  const formatValue = (val) => {
    if (valueType === 'currency') {
      return formatCurrency(val);
    }
    return formatNumber(val);
  };

  const formatChange = (val) => {
    if (valueType === 'currency') {
      return formatCurrency(val);
    }
    return formatNumber(val);
  };

  return (
    <Card>
      <CardHeader>
        <IconContainer color={color}>
          <Icon />
        </IconContainer>
        
        <CardContent>
          <Title>{title}</Title>
          <Value>{formatValue(value)}</Value>
          
          <ChangeContainer>
            <TrendIcon trend={trend}>
              {trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
            </TrendIcon>
            <ChangeValue trend={trend}>
              {formatChange(change)}
            </ChangeValue>
            <ChangeLabel>{changeLabel}</ChangeLabel>
          </ChangeContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default StatsCard; 