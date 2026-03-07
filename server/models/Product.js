const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['dairy', 'vegetables', 'fruits', 'beverages', 'snacks'],
    default: 'dairy'
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
    enum: [
      'milk', 'cheese', 'yogurt', 'butter', 'cream',
      'leafy_greens', 'root_vegetables', 'tomatoes', 'peppers', 'onions',
      'citrus', 'berries', 'tropical', 'apples', 'bananas',
      'juice', 'smoothies', 'tea', 'coffee',
      'nuts', 'seeds', 'dried_fruits'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  currency: {
    type: String,
    default: 'XOF',
    enum: ['XOF', 'USD', 'EUR']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'g', 'l', 'ml', 'pieces', 'bottles', 'packets']
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative']
    },
    maxStock: {
      type: Number,
      min: [0, 'Max stock cannot be negative']
    }
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    brand: String,
    origin: String,
    organic: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    lactoseFree: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  expiryDate: Date,
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    requiresRefrigeration: {
      type: Boolean,
      default: false
    },
    maxDeliveryDays: {
      type: Number,
      default: 3
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'inventory.quantity': 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.inventory.quantity > 0 && this.status === 'active';
});

// Virtual for checking if product is low in stock
productSchema.virtual('lowStock').get(function() {
  return this.inventory.quantity <= this.inventory.lowStockThreshold && this.inventory.quantity > 0;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'subtract') {
  if (operation === 'add') {
    this.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  }
  
  // Update status based on inventory
  if (this.inventory.quantity === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && this.inventory.quantity > 0) {
    this.status = 'active';
  }
  
  return this.save();
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    category, 
    status: 'active',
    'inventory.quantity': { $gt: 0 }
  })
  .limit(limit)
  .sort({ featured: -1, rating: -1 });
};

// Static method to get low stock products
productSchema.statics.getLowStockProducts = function() {
  return this.find({
    'inventory.quantity': { $lte: '$inventory.lowStockThreshold' },
    'inventory.quantity': { $gt: 0 },
    status: 'active'
  });
};

module.exports = mongoose.model('Product', productSchema); 