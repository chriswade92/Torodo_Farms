const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Admin authorization middleware
const adminAuthMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, async () => {
      const user = await User.findById(req.user.userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = {
  auth: authMiddleware,
  adminAuth: adminAuthMiddleware
}; 