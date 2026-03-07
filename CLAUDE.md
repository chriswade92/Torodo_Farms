# Torodo Farms — Project Reference for Claude

## Project Overview
E-commerce platform for a Nigerian farm selling **dairy milk and fresh vegetables**.
- **Customers** use a React Native mobile app to browse, order, and track deliveries
- **Admin/Seller** uses a React web dashboard to manage products, orders, customers, and view analytics
- **Currency**: NGN (Nigerian Naira)
- **Payment**: Cash on Delivery (no Stripe integration needed)
- **Location**: Nigeria (default country on all addresses/users)

---

## Repository
**GitHub**: https://github.com/chriswade92/Torodo_Farms

---

## Tech Stack

### Backend (`/server/`)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication (7-day expiry)
- bcryptjs for password hashing
- Helmet, compression, express-rate-limit for security
- **Port**: 5000 (default)

### Web Dashboard (`/client/`)
- React 18 + React Router v6
- Redux Toolkit (state management)
- Styled Components (theming via CSS variables)
- Chart.js + react-chartjs-2
- Axios (proxied to http://localhost:5000)
- **Port**: 3000 (default CRA)

### Mobile App (`/mobile/`)
- React Native 0.72.4
- Redux Toolkit
- React Navigation (bottom tabs + stack)
- Axios (API base: http://localhost:5000/api)
- AsyncStorage for token persistence

---

## Design System
Reference file: `Milkapp Visual Design Profile.json`

| Token | Value |
|-------|-------|
| Primary | `#64CFF6` (light blue) |
| Background | `#F8F9FA` |
| Secondary (white) | `#FFFFFF` |
| Text | `#1A1A1A` |
| Sub Text | `#888888` |
| Accent Green | `#82D173` |
| Accent Orange | `#F7A655` |
| Accent Pink | `#FF5E7E` |
| Accent Purple | `#A97CFF` |
| Accent Yellow | `#FFD93D` |

Web uses CSS variables defined in `client/src/index.css`.
Mobile uses `mobile/src/constants/Colors.js`.

---

## Project Structure

```
torodofarms/
├── server/                  # Backend — 100% complete
│   ├── index.js             # Express entry point
│   ├── models/
│   │   ├── User.js          # Role: customer | admin
│   │   ├── Product.js       # Categories: dairy, vegetables, fruits, beverages, snacks
│   │   └── Order.js         # Statuses: pending → confirmed → processing → shipped → delivered | cancelled
│   ├── routes/
│   │   ├── auth.js          # /api/auth/*
│   │   ├── products.js      # /api/products/*
│   │   ├── orders.js        # /api/orders/*
│   │   ├── users.js         # /api/users/*
│   │   ├── analytics.js     # /api/analytics/*
│   │   └── payments.js      # /api/payments/* (Stripe — not actively used)
│   └── middleware/
│       └── auth.js          # JWT auth + adminAuth middleware
│
├── client/                  # Admin web dashboard
│   └── src/
│       ├── App.js           # Routes: /login, /dashboard, /products, /orders, /customers, /analytics
│       ├── store/
│       │   ├── index.js
│       │   └── slices/
│       │       ├── authSlice.js       # login, register, getProfile, updateProfile, logout
│       │       ├── analyticsSlice.js  # fetchDashboardStats, fetchSalesData, fetchProductAnalytics, etc.
│       │       ├── productSlice.js    # fetchProducts, createProduct, updateProduct, deleteProduct
│       │       ├── orderSlice.js      # fetchOrders, updateOrderStatus, getOrderById
│       │       ├── customerSlice.js   # fetchCustomers, getCustomerById, updateCustomer
│       │       └── uiSlice.js
│       └── components/
│           ├── auth/
│           │   ├── Login.js           # Demo: admin@torodofarms.com / admin123
│           │   └── ProtectedRoute.js
│           ├── layout/
│           │   └── Layout.js          # Sidebar nav + header
│           ├── dashboard/
│           │   ├── Dashboard.js       # Main dashboard page
│           │   ├── StatsCard.js       # Reusable stat card
│           │   ├── SalesChart.js      # Line chart (Chart.js)
│           │   ├── TopProducts.js     # Top 5 by revenue
│           │   ├── RecentOrders.js    # Last 5 orders from API
│           │   └── InventoryAlerts.js # Low/out-of-stock from analytics API
│           ├── products/
│           │   └── ProductsPage.js    # CRUD table with add/edit modal
│           ├── orders/
│           │   └── OrdersPage.js      # Orders table, status filter, expandable rows, status update
│           ├── customers/
│           │   └── CustomersPage.js   # Customer table, search, expandable detail
│           └── analytics/
│               └── AnalyticsPage.js   # Sales chart, category bar chart, top products/customers tables
│
└── mobile/                  # Customer mobile app
    └── src/
        ├── constants/
        │   └── Colors.js
        ├── navigation/
        │   └── AppNavigator.js      # Auth stack + bottom tabs
        ├── store/
        │   └── slices/
        │       ├── authSlice.js     # login, register, getProfile, updateProfile, logout
        │       ├── productSlice.js  # fetchProducts, fetchProductsByCategory
        │       ├── cartSlice.js     # addToCart({ product, quantity }), removeFromCart, updateQuantity, clearCart
        │       └── orderSlice.js    # createOrder, fetchOrders, fetchOrderById
        └── screens/
            ├── auth/
            │   ├── LoginScreen.js    # Complete
            │   └── RegisterScreen.js # Complete — name, email, phone, password
            └── main/
                ├── HomeScreen.js     # Featured products, category nav, real API
                ├── ProductsScreen.js # Product grid, category filter, search, add-to-cart
                ├── CartScreen.js     # Cart items, qty control, address form, cash-on-delivery order
                ├── OrdersScreen.js   # Order list, pull-to-refresh, expandable detail + timeline
                └── ProfileScreen.js  # View/edit profile, logout
```

---

## Key Conventions

### Backend
- Soft-delete products: set `status: 'discontinued'` (never hard delete)
- Order numbers format: `TF{YY}{MM}{DD}{sequence}` e.g. `TF260307001`
- All admin routes use `adminAuth` middleware
- JWT token sent as `Authorization: Bearer <token>`

### Web Dashboard
- All styled with `styled-components` using CSS variables from `index.css`
- Token stored in `localStorage` as `'token'`
- API calls use Axios with proxy to port 5000 (set in `client/package.json`)
- Color variables: `var(--primary)`, `var(--accent-green)`, `var(--accent-pink)`, etc.

### Mobile App
- Token stored in `AsyncStorage` as `'token'`
- `addToCart` dispatch requires `{ product: {...}, quantity: 1 }` format
- API base URL: `http://localhost:5000/api` (update to production URL when deploying)
- Cash on delivery only — `paymentMethod: 'cash_on_delivery'`

---

## Environment Variables (`.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...        # Not actively used
STRIPE_PUBLISHABLE_KEY=pk_test_...   # Not actively used
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

## Running the Project
```bash
# Install all dependencies
npm run install-all

# Start backend + web dashboard together
npm run dev

# Backend only
npm run server

# Web dashboard only
npm run client

# Mobile app
cd mobile && npx react-native run-android
# or
cd mobile && npx react-native run-ios
```

---

## API Endpoints Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/profile | Private |
| PUT | /api/auth/password | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/products | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin (soft) |
| PUT | /api/products/:id/inventory | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders | Private |
| GET | /api/orders | Private (admin sees all, customer sees own) |
| GET | /api/orders/:id | Private |
| PUT | /api/orders/:id/status | Admin |

### Analytics (all Admin only)
| Method | Endpoint |
|--------|----------|
| GET | /api/analytics/dashboard |
| GET | /api/analytics/sales?period=7d\|30d\|90d\|1y |
| GET | /api/analytics/products |
| GET | /api/analytics/categories |
| GET | /api/analytics/inventory |
| GET | /api/analytics/customers |

---

## What's Left / Future Work
- [ ] Product image upload (multer is installed, endpoint not wired)
- [ ] Push notifications for order status updates
- [ ] Password reset email (backend route exists, email sending is TODO)
- [ ] Deployment configuration (update mobile API_BASE_URL from localhost)
- [ ] Admin seeder script (sample products/users for fresh installs)
