const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  image: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'XOF',
    enum: ['XOF', 'NGN', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'cash_on_delivery', 'mobile_money', 'wave', 'orange_money'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    paymentDate: Date,
    gateway: String
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    country: {
      type: String,
      default: 'Nigeria'
    },
    phone: {
      type: String,
      required: true
    },
    instructions: String
  },
  delivery: {
    method: {
      type: String,
      enum: ['standard', 'express', 'same_day'],
      default: 'standard'
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingNumber: String,
    carrier: String,
    notes: String
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    admin: String
  },
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'delivery.estimatedDelivery': 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = (orderCount + 1).toString().padStart(4, '0');
    this.orderNumber = `TF${year}${month}${day}${sequence}`;
    
    // Add initial timeline entry
    this.timeline.push({
      status: 'pending',
      note: 'Order created',
      timestamp: new Date()
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note,
    updatedBy,
    timestamp: new Date()
  });
  
  // Update payment status if order is cancelled
  if (newStatus === 'cancelled' && this.paymentStatus === 'paid') {
    this.paymentStatus = 'refunded';
  }
  
  return this.save();
};

// Method to calculate order totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  return this;
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 20) {
  return this.find({ status })
    .populate('customer', 'name email phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get customer orders
orderSchema.statics.getCustomerOrders = function(customerId, limit = 20) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get orders for delivery
orderSchema.statics.getDeliveryOrders = function() {
  return this.find({
    status: { $in: ['confirmed', 'processing'] },
    'delivery.estimatedDelivery': { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } // Next 24 hours
  })
  .populate('customer', 'name phone')
  .sort({ 'delivery.estimatedDelivery': 1 });
};

module.exports = mongoose.model('Order', orderSchema); 