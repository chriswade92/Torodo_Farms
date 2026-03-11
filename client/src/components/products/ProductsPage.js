import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX, FiSearch, FiImage, FiUploadCloud } from 'react-icons/fi';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setCurrentProduct,
  clearCurrentProduct,
} from '../../store/slices/productSlice';

const SUBCATEGORY_MAP = {
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
  vegetables: ['leafy_greens', 'root_vegetables', 'tomatoes', 'peppers', 'onions'],
  fruits: ['citrus', 'berries', 'tropical', 'apples', 'bananas'],
  beverages: ['juice', 'smoothies', 'tea', 'coffee'],
  snacks: ['nuts', 'seeds', 'dried_fruits'],
};

const CATEGORY_EMOJI = { dairy: '🥛', vegetables: '🥦', fruits: '🍎', beverages: '🧃', snacks: '🥜' };

const getPrimaryImage = (product) => {
  if (!product?.images?.length) return null;
  const primary = product.images.find(img => img.isPrimary);
  return primary?.url || product.images[0]?.url || null;
};

// Styled components
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
  &:last-child td { border-bottom: none; }
  &:hover td { background: #FAFAFA; }
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const ProductThumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  max-width: 540px;
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

// Image upload area
const ImageUploadArea = styled.div`
  border: 2px dashed ${props => props.dragover ? 'var(--primary)' : '#E0E0E0'};
  border-radius: var(--border-radius-sm);
  background: ${props => props.dragover ? 'rgba(100,207,246,0.05)' : 'var(--background)'};
  padding: var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;

  &:hover { border-color: var(--primary); background: rgba(100,207,246,0.05); }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  background: #F5F5F5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover { background: rgba(0,0,0,0.75); }
`;

const UploadHint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--sub-text);
  pointer-events: none;

  svg { font-size: 28px; color: #C0C0C0; }
  p { margin: 0; font-size: 13px; }
  span { font-size: 11px; color: #B0B0B0; }
`;

const UploadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--primary);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-sm);
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
  const token = useSelector(state => state.auth?.token);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // local preview URL
  const [imageUrl, setImageUrl] = useState('');           // uploaded server URL
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
    setImagePreview(null);
    setImageUrl('');
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
    const existingImg = getPrimaryImage(product);
    setImagePreview(existingImg ? `http://localhost:5000${existingImg}` : null);
    setImageUrl(existingImg || '');
    setIsEditing(true);
    setEditId(product._id);
    setFormError('');
    dispatch(setCurrentProduct(product));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImagePreview(null);
    setImageUrl('');
    dispatch(clearCurrentProduct());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      // Reset subcategory when category changes
      if (name === 'category') next.subcategory = '';
      return next;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setImageUrl(res.data.url);
    } catch (err) {
      setFormError('Image upload failed. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price || form['inventory.quantity'] === '') {
      setFormError('Name, description, price and quantity are required.');
      return;
    }
    if (!form.subcategory) {
      setFormError('Please select a subcategory.');
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

    if (imageUrl) {
      payload.images = [{ url: imageUrl, alt: form.name, isPrimary: true }];
    }

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
    `${Math.round(n || 0).toLocaleString('fr-SN')} FCFA`;

  const subcategories = SUBCATEGORY_MAP[form.category] || [];

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
              filtered.map(product => {
                const imgUrl = getPrimaryImage(product);
                return (
                  <Tr key={product._id}>
                    <Td>
                      <ProductCell>
                        <ProductThumb>
                          {imgUrl
                            ? <img src={`http://localhost:5000${imgUrl}`} alt={product.name} />
                            : <span>{CATEGORY_EMOJI[product.category] || '📦'}</span>
                          }
                        </ProductThumb>
                        <div>
                          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--sub-text)', marginTop: '2px' }}>{product.unit}</div>
                        </div>
                      </ProductCell>
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
                );
              })
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

            {/* Image Upload */}
            <FormGroup full style={{ marginBottom: 'var(--spacing-md)', gridColumn: 'auto' }}>
              <label>Product Image</label>
              {imagePreview ? (
                <ImagePreview>
                  <img src={imagePreview} alt="Preview" />
                  {uploading && <UploadingOverlay>Uploading...</UploadingOverlay>}
                  <RemoveImageBtn onClick={handleRemoveImage} title="Remove image">
                    <FiX />
                  </RemoveImageBtn>
                </ImagePreview>
              ) : (
                <ImageUploadArea>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                  />
                  <UploadHint>
                    <FiUploadCloud />
                    <p>Click to upload or drag & drop</p>
                    <span>JPG, PNG, WebP — max 5MB</span>
                  </UploadHint>
                </ImageUploadArea>
              )}
            </FormGroup>

            <FormGrid>
              <FormGroup full>
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Fresh Whole Milk" />
              </FormGroup>
              <FormGroup full>
                <label>Description *</label>
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
                <label>Subcategory *</label>
                <select name="subcategory" value={form.subcategory} onChange={handleChange}>
                  <option value="">Select subcategory</option>
                  {subcategories.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label>Price (FCFA) *</label>
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
              <SaveBtn onClick={handleSubmit} disabled={loading || uploading}>
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
