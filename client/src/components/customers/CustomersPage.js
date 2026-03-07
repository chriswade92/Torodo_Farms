import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiUsers, FiSearch, FiChevronDown, FiChevronUp, FiMapPin, FiBell } from 'react-icons/fi';
import { fetchCustomers } from '../../store/slices/customerSlice';

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--secondary);
  border: 1px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  width: 300px;

  svg { color: var(--sub-text); flex-shrink: 0; }

  input {
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    width: 100%;
    &::placeholder { color: var(--sub-text); }
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

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
  flex-shrink: 0;
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  background: ${props => props.active ? 'rgba(130,209,115,0.15)' : 'rgba(255,94,126,0.15)'};
  color: ${props => props.active ? 'var(--accent-green)' : 'var(--accent-pink)'};
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

const DetailRow = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  font-size: 13px;
  margin-bottom: 6px;

  span:first-child { color: var(--sub-text); min-width: 80px; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xxl);
  color: var(--sub-text);
  svg { font-size: 48px; margin-bottom: var(--spacing-md); color: #D0D0D0; }
  p { margin: 0; font-size: 14px; }
`;

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector(state => state.customers);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filtered = customers
    ? customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      )
    : [];

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Customers</Title>
        <SearchBar>
          <FiSearch />
          <input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchBar>
      </PageHeader>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Joined</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading...</Td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState>
                    <FiUsers />
                    <p>No customers found.</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filtered.map(customer => (
                <React.Fragment key={customer._id}>
                  <Tr onClick={() => toggleExpand(customer._id)}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <Avatar>{getInitials(customer.name)}</Avatar>
                        <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{customer.name}</span>
                      </div>
                    </Td>
                    <Td style={{ color: 'var(--sub-text)' }}>{customer.email}</Td>
                    <Td>{customer.phone || '—'}</Td>
                    <Td style={{ fontSize: '13px', color: 'var(--sub-text)' }}>{formatDate(customer.createdAt)}</Td>
                    <Td>
                      <StatusBadge active={customer.isActive}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </Td>
                    <Td>
                      {expandedId === customer._id ? <FiChevronUp /> : <FiChevronDown />}
                    </Td>
                  </Tr>

                  {expandedId === customer._id && (
                    <ExpandRow>
                      <ExpandTd colSpan={6}>
                        <DetailGrid>
                          <DetailSection>
                            <h4><FiMapPin /> Address</h4>
                            {customer.address?.street ? (
                              <>
                                <DetailRow><span>Street</span><span>{customer.address.street}</span></DetailRow>
                                <DetailRow><span>City</span><span>{customer.address.city}</span></DetailRow>
                                <DetailRow><span>State</span><span>{customer.address.state}</span></DetailRow>
                                <DetailRow><span>Country</span><span>{customer.address.country}</span></DetailRow>
                              </>
                            ) : (
                              <p style={{ fontSize: '13px', color: 'var(--sub-text)', margin: 0 }}>No address on file.</p>
                            )}
                          </DetailSection>

                          <DetailSection>
                            <h4><FiBell /> Notification Preferences</h4>
                            <DetailRow>
                              <span>Email</span>
                              <span>{customer.preferences?.notifications?.email ? 'On' : 'Off'}</span>
                            </DetailRow>
                            <DetailRow>
                              <span>Push</span>
                              <span>{customer.preferences?.notifications?.push ? 'On' : 'Off'}</span>
                            </DetailRow>
                            <DetailRow>
                              <span>SMS</span>
                              <span>{customer.preferences?.notifications?.sms ? 'On' : 'Off'}</span>
                            </DetailRow>
                            {customer.preferences?.favoriteCategories?.length > 0 && (
                              <DetailRow>
                                <span>Favorites</span>
                                <span>{customer.preferences.favoriteCategories.join(', ')}</span>
                              </DetailRow>
                            )}
                          </DetailSection>
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

export default CustomersPage;
