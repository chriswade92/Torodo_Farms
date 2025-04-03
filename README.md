# Milk Sales Tracker

A mobile application for tracking milk sales, managing stock, and handling customer subscriptions.

## Features

- Stock Management
  - Track stock levels across multiple warehouses
  - Transfer stock between warehouses
  - Stock history tracking

- Customer Management
  - Customer profiles
  - Order history
  - Customer analytics

- Subscription System
  - Manage customer subscriptions
  - Delivery scheduling
  - Subscription history

- Data Persistence
  - Local storage for offline access
  - Data backup and restore

- Theme Support
  - Light and dark mode
  - System theme detection

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/milk-sales-tracker.git
cd milk-sales-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

5. Run on iOS:
```bash
npm run ios
```

## Project Structure

```
src/
├── assets/         # Images, fonts, and other static files
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
