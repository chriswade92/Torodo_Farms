# Torodo Farms - Setup Guide

This guide will help you set up and run the complete Torodo Farms application, including the backend server, admin dashboard, and mobile app.

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the automated startup script
start-app.bat
```

### Option 2: Automated Setup (Linux/Mac)
```bash
# Make the script executable
chmod +x start-app.sh

# Run the automated startup script
./start-app.sh
```

### Option 3: Manual Setup
Follow the detailed steps below.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (for database)
- **Git** (for version control)

## 🔧 Installation Steps

### 1. Clone and Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp ../env.example .env

# Edit .env file with your configuration
# Update MongoDB URI, JWT secret, and other variables
```

### 2. Setup Database

```bash
# Start MongoDB (if not running as a service)
mongod

# The server will automatically create the database and collections
```

### 3. Setup Admin Dashboard

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# The app will start on http://localhost:3000
```

### 4. Setup Mobile App (Optional)

```bash
# Navigate to mobile directory
cd ../mobile

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on device/emulator
npm run android  # or npm run ios
```

## 🌐 Running the Application

### Start Backend Server
```bash
cd server
npm start
```
Server will run on: http://localhost:5000

### Start Admin Dashboard
```bash
cd client
npm start
```
Dashboard will run on: http://localhost:3000

### Start Mobile App
```bash
cd mobile
npm start
# Then run: npm run android or npm run ios
```

## 🔐 Default Login Credentials

For testing purposes, you can use these demo credentials:

**Admin Dashboard:**
- Email: `admin@torodofarms.com`
- Password: `admin123`

**Mobile App:**
- Email: `customer@example.com`
- Password: `password123`

## 📁 Project Structure

```
torodofarms/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Admin Dashboard (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store
│   │   └── screens/       # Dashboard screens
│   └── public/            # Static files
├── mobile/                # Mobile App (React Native)
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── navigation/    # Navigation config
│   │   └── store/         # Redux store
│   └── App.js             # App entry point
└── env.example            # Environment variables template
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/torodofarms

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# File Upload (optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 🧪 Testing the Application

### 1. Backend API Testing

```bash
# Test the server
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@torodofarms.com","password":"admin123"}'
```

### 2. Admin Dashboard Testing

1. Open http://localhost:3000
2. Login with admin credentials
3. Navigate through different sections
4. Test dashboard features

### 3. Mobile App Testing

1. Start the Metro bundler
2. Run on device or emulator
3. Test authentication flow
4. Browse products and features

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process using port 3000
npx kill-port 3000

# Kill process using port 5000
npx kill-port 5000
```

**2. MongoDB Connection Error**
```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env file
```

**3. Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. React Native Issues**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clean and rebuild
cd android && ./gradlew clean && cd ..
```

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review the logs in each terminal window

## 📱 Mobile App Development

### Prerequisites for Mobile Development

- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **React Native CLI**
- **Android SDK** and **iOS Simulator**

### Running on Physical Device

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Run `npm run android` or `npm run ios`

## 🚀 Deployment

### Backend Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to Heroku, Vercel, or your preferred platform
3. Update environment variables
4. Set up domain and SSL

### Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Update API endpoints to production URLs

### Mobile App Deployment

1. Generate signed APK/AAB for Android
2. Archive and upload to App Store Connect for iOS
3. Configure app signing and metadata

## 📞 Support

For additional support:

- Check the documentation in each project directory
- Review the README files
- Create an issue in the repository
- Contact the development team

## 🎉 Success!

Once everything is running, you should have:

- ✅ Backend API running on port 5000
- ✅ Admin Dashboard running on port 3000
- ✅ Mobile app ready for development
- ✅ Database connected and working
- ✅ Authentication system functional

Happy coding! 🚀 