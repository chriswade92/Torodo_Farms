import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX, FiSearch } from 'react-icons/fi';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setCurrentProduct,
  clearCurrentProduct,
} from '../../store/slices/productSlice';

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

const AddButton = styled.button`
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
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--secondary);
  border: 1px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  width: 280px;

  svg {
    color: var(--sub-text);
    flex-shrink: 0;
  }

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
  &:last-child td { border-bottom: none; }
  &:hover td { background: #FAFAFA; }
`;

const CategoryBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  background: ${props => props.cat === 'dairy' ? 'rgba(100,207,246,0.15)' : 'rgba(130,209,115,0.15)'};
  color: ${props => props.cat === 'dairy' ? 'var(--primary)' : 'var(--accent-green)'};
  text-transform: capitalize;
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  background: ${props => props.status === 'active' ? 'rgba(130,209,115,0.15)' : 'rgba(255,94,126,0.15)'};
  color: ${props => props.status === 'active' ? 'var(--accent-green)' : 'var(--accent-pink)'};
  text-transform: capitalize;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--border-radius-sm);
  color: ${props => props.danger ? 'var(--accent-pink)' : 'var(--primary)'};
  transition: all var(--transition-fast);

  &:hover { background: ${props => props.danger ? 'rgba(255,94,126,0.1)' : 'rgba(100,207,246,0.1)'}; }

  svg { font-size: 16px; display: block; }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xxl);
  color: var(--sub-text);

  svg { font-size: 48px; margin-bottom: var(--spacing-md); color: #D0D0D0; }
  p { margin: 0; font-size: 14px; }
`;

// Modal
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
`;

const Modal = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: var(--font-weight-semibold);
    color: var(--text);
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--sub-text);
  padding: 4px;
  border-radius: 4px;
  &:hover { color: var(--text); }
  svg { font-size: 20px; display: block; }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${props => props.full ? '1 / -1' : 'auto'};

  label {
    font-size: 13px;
    font-weight: var(--font-weight-medium);
    color: var(--text);
  }

  input, select, textarea {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid #E0E0E0;
    border-radius: var(--border-radius-sm);
    font-size: 14px;
    color: var(--text);
    background: var(--background);
    outline: none;
    transition: border-color var(--transition-fast);

    &:focus { border-color: var(--primary); }
  }

  textarea { resize: vertical; min-height: 80px; }
`;

const ErrorMsg = styled.p`
  color: var(--accent-pink);
  font-size: 13px;
  margin: var(--spacing-sm) 0 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
`;

const CancelBtn = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: transparent;
  color: var(--sub-text);
  border: 1px solid #E0E0E0;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  &:hover { border-color: var(--text); color: var(--text); }
`;

const SaveBtn = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  &:hover { background: #5BB8E0; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const EMPTY_FORM = {
  name: '', description: '', category: 'dairy', subcategory: '',
  price: '', unit: 'L', 'inventory.quantity': '', 'inventory.lowStockThreshold': '10',
};

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filtered = products
    ? products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setIsEditing(false);
    setEditId(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'dairy',
      subcategory: product.subcategory || '',
      price: product.price || '',
      unit: product.unit || 'L',
      'inventory.quantity': product.inventory?.quantity ?? '',
      'inventory.lowStockThreshold': product.inventory?.lowStockThreshold ?? '10',
    });
    setIsEditing(true);
    setEditId(product._id);
    setFormError('');
    dispatch(setCurrentProduct(product));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(clearCurrentProduct());
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || form['inventory.quantity'] === '') {
      setFormError('Name, price and quantity are required.');
      return;
    }
    setFormError('');

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      subcategory: form.subcategory,
      price: parseFloat(form.price),
      unit: form.unit,
      inventory: {
        quantity: parseInt(form['inventory.quantity']),
        lowStockThreshold: parseInt(form['inventory.lowStockThreshold']) || 10,
      },
    };

    if (isEditing) {
      await dispatch(updateProduct({ id: editId, productData: payload }));
    } else {
      await dispatch(createProduct(payload));
    }
    closeModal();
    dispatch(fetchProducts());
  };

  const handleDelete = (id) => {
    if (window.confirm('Discontinue this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n || 0);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Products</Title>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar>
            <FiSearch />
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchBar>
          <AddButton onClick={openAdd}>
            <FiPlus /> Add Product
          </AddButton>
        </div>
      </PageHeader>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading...</Td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState>
                    <FiPackage />
                    <p>No products found.</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filtered.map(product => (
                <Tr key={product._id}>
                  <Td>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--sub-text)', marginTop: '2px' }}>{product.unit}</div>
                  </Td>
                  <Td><CategoryBadge cat={product.category}>{product.category}</CategoryBadge></Td>
                  <Td>{formatCurrency(product.price)}</Td>
                  <Td>{product.inventory?.quantity ?? '—'}</Td>
                  <Td><StatusBadge status={product.status}>{product.status}</StatusBadge></Td>
                  <Td>
                    <ActionsCell>
                      <ActionBtn onClick={() => openEdit(product)} title="Edit">
                        <FiEdit2 />
                      </ActionBtn>
                      <ActionBtn danger onClick={() => handleDelete(product._id)} title="Delete">
                        <FiTrash2 />
                      </ActionBtn>
                    </ActionsCell>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {showModal && (
        <Overlay onClick={closeModal}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
              <CloseBtn onClick={closeModal}><FiX /></CloseBtn>
            </ModalHeader>

            <FormGrid>
              <FormGroup full>
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Fresh Whole Milk" />
              </FormGroup>
              <FormGroup full>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />
              </FormGroup>
              <FormGroup>
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="dairy">Dairy</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Subcategory</label>
                <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="e.g. Whole Milk" />
              </FormGroup>
              <FormGroup>
                <label>Price (NGN) *</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="0" />
              </FormGroup>
              <FormGroup>
                <label>Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange}>
                  <option value="L">Litre (L)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="pack">Pack</option>
                  <option value="bottle">Bottle</option>
                  <option value="sachet">Sachet</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Stock Quantity *</label>
                <input name="inventory.quantity" type="number" min="0" value={form['inventory.quantity']} onChange={handleChange} placeholder="0" />
              </FormGroup>
              <FormGroup>
                <label>Low Stock Threshold</label>
                <input name="inventory.lowStockThreshold" type="number" min="0" value={form['inventory.lowStockThreshold']} onChange={handleChange} placeholder="10" />
              </FormGroup>
            </FormGrid>

            {formError && <ErrorMsg>{formError}</ErrorMsg>}

            <ModalActions>
              <CancelBtn onClick={closeModal}>Cancel</CancelBtn>
              <SaveBtn onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Product'}
              </SaveBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
};

export default ProductsPage;
