# Torodo Farms Mobile App

A React Native mobile application for Torodo Farms, an e-commerce platform for dairy milk and fresh vegetables. This app provides customers with a seamless shopping experience for fresh farm products.

## Features

### 🛍️ Shopping Experience
- **Product Browsing**: Browse through dairy products and fresh vegetables
- **Category Filtering**: Filter products by categories (Dairy, Vegetables, Fruits, etc.)
- **Product Search**: Search for specific products
- **Product Details**: View detailed product information, pricing, and reviews

### 🛒 Shopping Cart
- **Add to Cart**: Add products to shopping cart
- **Quantity Management**: Adjust product quantities
- **Cart Summary**: View cart total and item count
- **Checkout Process**: Seamless checkout with payment integration

### 📦 Order Management
- **Order History**: View past orders
- **Order Tracking**: Track order status in real-time
- **Order Details**: Detailed view of each order

### 👤 User Management
- **User Authentication**: Secure login and registration
- **Profile Management**: Update personal information
- **Address Management**: Manage delivery addresses

### 🎨 Design System
- **Modern UI**: Clean and intuitive interface
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Mode**: Support for different themes
- **Smooth Animations**: Enhanced user experience

## Tech Stack

- **React Native**: 0.72.4
- **React Navigation**: For navigation between screens
- **Redux Toolkit**: State management
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local data persistence
- **React Native Vector Icons**: Icon library
- **React Native Linear Gradient**: Gradient backgrounds

## Prerequisites

Before running this app, make sure you have the following installed:

- **Node.js**: Version 16 or higher
- **React Native CLI**: Latest version
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Metro**: React Native bundler

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd torodo-farms/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run the app**

   **For Android:**
   ```bash
   npm run android
   ```

   **For iOS:**
   ```bash
   npm run ios
   ```

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and colors
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   │   ├── auth/           # Authentication screens
│   │   └── main/           # Main app screens
│   ├── store/              # Redux store and slices
│   │   └── slices/         # Redux slices
│   └── utils/              # Utility functions
├── App.js                  # Main app component
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## API Integration

The mobile app connects to the Torodo Farms backend API. Make sure the backend server is running on `http://localhost:5000` or update the API base URL in the store slices.

### API Endpoints Used

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Payments**: `/api/payments/*`

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
API_BASE_URL=http://localhost:5000/api
STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Development

### Code Style

- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for better UX
- Use TypeScript for type safety (optional)

### State Management

The app uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication and profile
- **productSlice**: Product data and filtering
- **cartSlice**: Shopping cart management
- **orderSlice**: Order history and tracking

### Navigation

The app uses React Navigation with the following structure:

- **Auth Stack**: Login and Registration screens
- **Main Tabs**: Home, Products, Cart, Orders, and Profile screens

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Building for Production

### Android

1. **Generate signed APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Generate signed AAB**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

### iOS

1. **Archive the app in Xcode**
2. **Upload to App Store Connect**

## Deployment

### Android

1. Build the release APK/AAB
2. Upload to Google Play Console
3. Configure app signing
4. Submit for review

### iOS

1. Archive the app in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community
- React Navigation team
- Redux Toolkit team
- All contributors to the project 