const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics overview
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const analytics = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      // Today's revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: today },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      // This month's revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: thisMonth },
            paymentStatus: 'paid'
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      
      // Total orders
      Order.countDocuments(),
      
      // Today's orders
      Order.countDocuments({ createdAt: { $gte: today } }),
      
      // Total customers
      User.countDocuments({ role: 'customer' }),
      
      // Today's new customers
      User.countDocuments({ 
        role: 'customer',
        createdAt: { $gte: today }
      }),
      
      // Low stock products
      Product.countDocuments({
        'inventory.quantity': { $lte: '$inventory.lowStockThreshold' },
        'inventory.quantity': { $gt: 0 },
        status: 'active'
      }),
      
      // Out of stock products
      Product.countDocuments({
        'inventory.quantity': 0,
        status: 'active'
      })
    ]);

    const [
      totalRevenue,
      todayRevenue,
      monthRevenue,
      totalOrders,
      todayOrders,
      totalCustomers,
      todayCustomers,
      lowStockCount,
      outOfStockCount
    ] = analytics;

    res.json({
      revenue: {
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0,
        thisMonth: monthRevenue[0]?.total || 0
      },
      orders: {
        total: totalOrders,
        today: todayOrders
      },
      customers: {
        total: totalCustomers,
        today: todayCustomers
      },
      inventory: {
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/sales
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          averageOrder: { $avg: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ salesData });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/products
// @desc    Get product analytics
// @access  Private/Admin
router.get('/products', adminAuth, async (req, res) => {
  try {
    const productAnalytics = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          totalSold: 1,
          totalRevenue: 1,
          orderCount: 1,
          currentStock: '$product.inventory.quantity'
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({ productAnalytics });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get category analytics
// @access  Private/Admin
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categoryAnalytics = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ categoryAnalytics });
  } catch (error) {
    console.error('Category analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/inventory
// @desc    Get inventory analytics
// @access  Private/Admin
router.get('/inventory', adminAuth, async (req, res) => {
  try {
    const inventoryAnalytics = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$inventory.quantity' },
          lowStock: {
            $sum: {
              $cond: [
                { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
                1,
                0
              ]
            }
          },
          outOfStock: {
            $sum: {
              $cond: [
                { $eq: ['$inventory.quantity', 0] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);

    res.json({ inventoryAnalytics });
  } catch (error) {
    console.error('Inventory analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/customers
// @desc    Get customer analytics
// @access  Private/Admin
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const customerAnalytics = await Order.aggregate([
      {
        $group: {
          _id: '$customer',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrder: { $avg: '$total' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          name: '$customer.name',
          email: '$customer.email',
          totalOrders: 1,
          totalSpent: 1,
          averageOrder: 1,
          lastOrder: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.json({ customerAnalytics });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 