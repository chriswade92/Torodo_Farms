# Torodo Farms — Project Reference for Claude

## Project Overview
E-commerce platform for a **Senegalese farm** (Dakar, Senegal) selling **dairy milk (Sénega'lait brand) and fresh vegetables**.
- **Customers** use a React Native mobile app to browse, order, and track deliveries
- **Admin/Seller** uses a React web dashboard to manage products, orders, customers, and view analytics
- **Currency**: FCFA / XOF (West African CFA franc) — formatted with `toLocaleString('fr-SN')`
- **Payment**: Cash on Delivery + Wave mobile money (deep link) + Orange Money (coming soon)
- **Location**: Senegal / Dakar (default country on all addresses/users)

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
- Multer for product image uploads (uploads stored in `server/uploads/`)
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
- Axios (API base: http://10.0.2.2:5000/api on Android emulator, http://localhost:5000/api on iOS)
- AsyncStorage for token persistence

---

## Brand & Design System

### Torodo Farms Brand Identity
- **Logo file**: `mobile/src/pictures/IMG-20250404-WA0000.jpg` (also copied to `client/src/assets/logo.jpg`)
- **Brand background**: `#111800` (very dark green/black)
- **Brand accent**: `#76C326` (lime green)
- Web sidebar and login page use this dark green background with lime green accents

### Mobile Color Tokens (`mobile/src/constants/Colors.js`)
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

### Payment Method Brand Colors
- **Wave**: `#1DC8FF` — logo at `mobile/src/pictures/wavelogo.png`
- **Orange Money**: `#FF7900` — logo at `mobile/src/pictures/orangelogo.png`
- Wave payment URL: `https://pay.wave.com/m/M_sn_R_TKbBC1MtLt/c/sn/`

### Delivery Zones (Dakar)
| Zone | Fee (FCFA) | Areas |
|------|-----------|-------|
| Zone 1 | 1,000 | Plateau, Médina, HLM |
| Zone 2 | 1,500 | Almadies, Ngor, Ouakam, Mermoz |
| Zone 3 | 2,000 | Pikine, Guédiawaye, Parcelles |
| Zone 4 | 2,500 | Rufisque, Bargny, Sébikotane |

---

## Product Images

### Local Bundled Images (`mobile/src/pictures/`)
- `IMG-20250412-WA0050.jpg` — Sénega'lait Lait frais pasteurisé (blue label)
- `IMG-20250412-WA0051.jpg` — Sénega'lait Lait frais pasteurisé (dark navy variant)
- `IMG-20250412-WA0052.jpg` — Sénega'lait Soow piir / lait caillé (red label)
- `IMG-20250412-WA0053.jpg` — Sénega'lait Soow piir (light bg variant) — also used as hero/banner image
- `IMG-20250404-WA0000.jpg` — Torodo Farms logo (black bg, lime green)
- `wavelogo.png` — Wave mobile money logo
- `orangelogo.png` — Orange Money logo

### Image Registry (`mobile/src/constants/productImages.js`)
- `getLocalProductImage(product)` — keyword-matches product name/subcategory to local image
  - "soow/piir/caillé/ferment" or subcategory=yogurt → `soow_piir` image
  - "lait/milk/pasteurisé/frais" or subcategory=milk → `lait_frais` image
  - Any dairy category fallback → `lait_frais` image
- `HERO_IMAGE` — exported for promo banner (WA0053)
- Server images take priority; local images are fallback; emoji is last resort

### Server Image URLs
- Uploaded images served at: `{API_BASE_URL}/uploads/`
- `UPLOADS_BASE_URL` constant in `mobile/src/config/api.js`

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
│   │   ├── products.js      # /api/products/* (includes image upload with multer)
│   │   ├── orders.js        # /api/orders/*
│   │   ├── users.js         # /api/users/*
│   │   ├── analytics.js     # /api/analytics/*
│   │   └── payments.js      # /api/payments/* (Stripe — not actively used)
│   ├── middleware/
│   │   └── auth.js          # JWT auth + adminAuth middleware
│   └── uploads/             # Product images uploaded via admin dashboard
│
├── client/                  # Admin web dashboard
│   └── src/
│       ├── App.js           # Routes: /login, /dashboard, /products, /orders, /customers, /analytics
│       ├── assets/
│       │   └── logo.jpg     # Torodo Farms logo (copied from mobile/src/pictures/)
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
│           │   ├── Login.js           # Demo: admin@torodofarms.com / admin123 — dark brand bg + logo
│           │   └── ProtectedRoute.js
│           ├── layout/
│           │   └── Layout.js          # Sidebar with Torodo Farms logo, dark #111800 bg, lime green accents
│           ├── dashboard/
│           │   ├── Dashboard.js       # Main dashboard page
│           │   ├── StatsCard.js       # Reusable stat card
│           │   ├── SalesChart.js      # Line chart (Chart.js)
│           │   ├── TopProducts.js     # Top 5 by revenue
│           │   ├── RecentOrders.js    # Last 5 orders from API
│           │   └── InventoryAlerts.js # Low/out-of-stock from analytics API
│           ├── products/
│           │   └── ProductsPage.js    # CRUD table with add/edit modal + image upload
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
        │   ├── Colors.js
        │   └── productImages.js     # Local image registry + getLocalProductImage()
        ├── config/
        │   └── api.js               # API_BASE_URL, UPLOADS_BASE_URL
        ├── navigation/
        │   └── AppNavigator.js      # Auth stack + bottom tabs
        ├── pictures/                # All local images (product photos, logos)
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
                ├── HomeScreen.js     # Featured products, category nav, Sénega'lait promo banner
                ├── ProductsScreen.js # Product grid, category filter, search, add-to-cart
                ├── CartScreen.js     # Cart items, qty control, address form, payment selector, COD/Wave order
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
- `paymentMethod` enum: `['card', 'bank_transfer', 'cash_on_delivery', 'mobile_money', 'wave', 'orange_money']`
- `currency` enum: `['XOF', 'NGN', 'USD', 'EUR']`, default: `'XOF'`
- Product `unit` field may be undefined — use `|| 'pieces'` fallback in order routes

### Web Dashboard
- All styled with `styled-components` using CSS variables from `index.css`
- Token stored in `localStorage` as `'token'`
- API calls use Axios with proxy to port 5000 (set in `client/package.json`)
- Color variables: `var(--primary)`, `var(--accent-green)`, `var(--accent-pink)`, etc.
- Sidebar/Login use Torodo Farms brand colors: `#111800` bg, `#76C326` lime green

### Mobile App
- Token stored in `AsyncStorage` as `'token'`
- `addToCart` dispatch requires `{ product: {...}, quantity: 1 }` format
- API base URL: `http://10.0.2.2:5000/api` (Android emulator) — update for production
- Payment methods available: `cash_on_delivery`, `wave` (active), `orange_money` (disabled/coming soon)
- Wave payment flow: select Wave → place order → success alert offers "Pay with Wave" button → `Linking.openURL(WAVE_URL)`
- Currency formatted: `Math.round(amount).toLocaleString('fr-SN') + ' FCFA'`

### Android App
- Launcher icon: Torodo Farms logo at all mipmap densities (mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi)
- Both `ic_launcher.png` and `ic_launcher_round.png` updated

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

# Mobile app (Android)
cd mobile && npx react-native run-android
# Note: use @react-native-community/cli@11.3.6 (not 12.x — removed 'start' command)

# Mobile app (iOS)
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
| POST | /api/products/:id/images | Admin (multer upload) |

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
- [ ] Push notifications for order status updates
- [ ] Password reset email (backend route exists, email sending is TODO)
- [ ] Deployment configuration (update mobile API_BASE_URL from localhost to production)
- [ ] Admin seeder script (sample products/users for fresh installs)
- [ ] Orange Money payment integration (UI placeholder already in CartScreen)
- [ ] Delivery zone selector in CartScreen (currently flat 1,000 FCFA fee)
