import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ProductsPage from './components/products/ProductsPage';
import OrdersPage from './components/orders/OrdersPage';
import CustomersPage from './components/customers/CustomersPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
