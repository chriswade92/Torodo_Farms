import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FiCalendar } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid #E0E0E0;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const ChartTitle = styled.h3`
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
`;

const PeriodSelector = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const PeriodButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #E0E0E0;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--text)'};
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'rgba(100, 207, 246, 0.1)'};
    border-color: ${props => props.active ? 'var(--primary)' : 'var(--primary)'};
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xxl);
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

const SalesChart = () => {
  const { salesData } = useSelector(state => state.analytics);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  const chartData = {
    labels: salesData.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: salesData.map(item => item.revenue),
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(100, 207, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'var(--primary)',
        pointBorderColor: 'var(--secondary)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Orders',
        data: salesData.map(item => item.orders),
        borderColor: 'var(--accent-green)',
        backgroundColor: 'rgba(130, 209, 115, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'var(--accent-green)',
        pointBorderColor: 'var(--secondary)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'var(--font-family)',
            size: 12,
          },
          color: 'var(--text)',
        },
      },
      tooltip: {
        backgroundColor: 'var(--secondary)',
        titleColor: 'var(--text)',
        bodyColor: 'var(--text)',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Revenue') {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#E0E0E0',
          drawBorder: false,
        },
        ticks: {
          color: 'var(--sub-text)',
          font: {
            family: 'var(--font-family)',
            size: 12,
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: '#E0E0E0',
          drawBorder: false,
        },
        ticks: {
          color: 'var(--sub-text)',
          font: {
            family: 'var(--font-family)',
            size: 12,
          },
          callback: function(value) {
            return formatCurrency(value);
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'var(--sub-text)',
          font: {
            family: 'var(--font-family)',
            size: 12,
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  if (!salesData || salesData.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>
            <FiCalendar />
            Sales Overview
          </ChartTitle>
        </ChartHeader>
        <NoDataMessage>
          <p>No sales data available for the selected period.</p>
        </NoDataMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <FiCalendar />
          Sales Overview
        </ChartTitle>
        
        <PeriodSelector>
          {periods.map((period) => (
            <PeriodButton
              key={period.value}
              active={selectedPeriod === period.value}
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </PeriodButton>
          ))}
        </PeriodSelector>
      </ChartHeader>
      
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </ChartContainer>
  );
};

export default SalesChart; 