import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchSalesData = createAsyncThunk(
  'analytics/fetchSalesData',
  async (period = '7d', { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/analytics/sales?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sales data');
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'analytics/fetchProductAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/analytics/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product analytics');
    }
  }
);

export const fetchCategoryAnalytics = createAsyncThunk(
  'analytics/fetchCategoryAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/analytics/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch category analytics');
    }
  }
);

export const fetchInventoryAnalytics = createAsyncThunk(
  'analytics/fetchInventoryAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/analytics/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch inventory analytics');
    }
  }
);

export const fetchCustomerAnalytics = createAsyncThunk(
  'analytics/fetchCustomerAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/analytics/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch customer analytics');
    }
  }
);

const initialState = {
  dashboardStats: null,
  salesData: [],
  productAnalytics: [],
  categoryAnalytics: [],
  inventoryAnalytics: [],
  customerAnalytics: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.dashboardStats = null;
      state.salesData = [];
      state.productAnalytics = [];
      state.categoryAnalytics = [];
      state.inventoryAnalytics = [];
      state.customerAnalytics = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sales Data
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload.salesData;
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Product Analytics
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.productAnalytics = action.payload.productAnalytics;
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Category Analytics
      .addCase(fetchCategoryAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryAnalytics = action.payload.categoryAnalytics;
      })
      .addCase(fetchCategoryAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Inventory Analytics
      .addCase(fetchInventoryAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryAnalytics = action.payload.inventoryAnalytics;
      })
      .addCase(fetchInventoryAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Customer Analytics
      .addCase(fetchCustomerAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.customerAnalytics = action.payload.customerAnalytics;
      })
      .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer; 