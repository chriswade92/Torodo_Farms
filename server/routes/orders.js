const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, deliveryMethod, notes } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Process items and calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.inventory.unit,
        total: itemTotal,
        image: product.images[0]?.url || ''
      });

      // Update inventory
      await product.updateInventory(item.quantity, 'subtract');
    }

    // Calculate delivery date
    const estimatedDelivery = new Date();
    switch (deliveryMethod) {
      case 'express':
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
        break;
      case 'same_day':
        estimatedDelivery.setHours(estimatedDelivery.getHours() + 6);
        break;
      default: // standard
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    }

    // Create order
    const order = new Order({
      customer: req.user.userId,
      items: processedItems,
      subtotal,
      shipping: deliveryMethod === 'express' ? 500 : deliveryMethod === 'same_day' ? 1000 : 200,
      total: subtotal + (deliveryMethod === 'express' ? 500 : deliveryMethod === 'same_day' ? 1000 : 200),
      paymentMethod,
      shippingAddress,
      delivery: {
        method: deliveryMethod,
        estimatedDelivery
      },
      notes: { customer: notes }
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error creating order' });
  }
});

// @route   GET /api/orders
// @desc    Get orders (filtered by user role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get user to check role
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    let filter = {};
    if (user.role === 'customer') {
      filter.customer = req.user.userId;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name images description');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user has access to this order
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    
    if (user.role === 'customer' && order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.updateStatus(status, note, req.user.userId);

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 