# Torodo Farms - E-commerce Platform

A comprehensive e-commerce platform for dairy milk and fresh vegetables, featuring a mobile app for customers and a web dashboard for sellers/admins.

## 🚀 Features

### Customer Mobile App
- Browse products with beautiful grid layout
- Place orders with integrated payment processing
- Real-time order tracking
- Personalized product recommendations
- User profile and order history
- Search and filter functionality

### Admin Web Dashboard
- Product and inventory management
- Sales analytics and monitoring
- Order processing and status updates
- Inventory alerts and notifications
- Comprehensive sales reports
- Customer management

## 🎨 Design System

Built with a light, fresh, and minimalist design following the Milkapp Visual Design Profile:
- **Primary Color**: #64CFF6 (Light Blue)
- **Background**: #F7FCFE (Very Light Blue)
- **Accent Colors**: Yellow, Pink, Green, Orange, Purple
- **Typography**: Rounded, Sans-Serif fonts
- **Components**: Rounded corners, subtle shadows, smooth animations

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **Nodemailer** for email notifications

### Frontend
- **React.js** for web dashboard
- **React Native** for mobile app
- **Styled Components** for styling
- **React Router** for navigation
- **Redux Toolkit** for state management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd torodo-farms
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=5000
```

## 📱 Mobile App

The mobile app is built with React Native and provides:
- Intuitive bottom navigation
- Product browsing with search
- Shopping cart functionality
- Secure payment processing
- Order tracking
- Push notifications

## 💻 Web Dashboard

The admin dashboard provides:
- Real-time inventory management
- Sales analytics and charts
- Order processing interface
- Customer management
- Report generation
- Bulk operations

## 🚀 Deployment

### Backend Deployment
```bash
npm run build
npm start
```

### Frontend Deployment
```bash
cd client
npm run build
```

## 📊 API Documentation

The API provides endpoints for:
- User authentication and management
- Product CRUD operations
- Order processing
- Payment integration
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 