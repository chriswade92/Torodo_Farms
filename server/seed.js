/**
 * Seed script — creates admin user + sample products
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const ADMIN = {
  name: 'Torodo Admin',
  email: 'admin@torodofarms.com',
  password: 'admin123',
  role: 'admin',
  phone: '+2348000000000',
  address: { street: '1 Farm Road', city: 'Lagos', state: 'Lagos', country: 'Nigeria' },
};

// inventory.unit enum: 'kg' | 'g' | 'l' | 'ml' | 'pieces' | 'bottles' | 'packets'
const PRODUCTS = [
  {
    name: 'Fresh Whole Milk',
    description: 'Farm-fresh whole milk, rich in calcium and vitamins. Collected daily from our healthy cows.',
    category: 'dairy', subcategory: 'milk',
    price: 1200, featured: true,
    inventory: { quantity: 100, unit: 'l', lowStockThreshold: 20 },
  },
  {
    name: 'Natural Yogurt',
    description: 'Creamy natural yogurt made from pure farm milk. No preservatives, no additives.',
    category: 'dairy', subcategory: 'yogurt',
    price: 800, featured: true,
    inventory: { quantity: 60, unit: 'packets', lowStockThreshold: 15 },
  },
  {
    name: 'Fresh Butter',
    description: 'Pure farm butter churned from fresh cream. Perfect for cooking and baking.',
    category: 'dairy', subcategory: 'butter',
    price: 1500,
    inventory: { quantity: 40, unit: 'packets', lowStockThreshold: 10 },
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Vine-ripened tomatoes harvested fresh from our farm. Juicy and full of flavor.',
    category: 'vegetables', subcategory: 'tomatoes',
    price: 500, featured: true,
    inventory: { quantity: 200, unit: 'kg', lowStockThreshold: 30 },
  },
  {
    name: 'Red Peppers',
    description: 'Fresh red peppers, great for cooking stews, soups, and Nigerian dishes.',
    category: 'vegetables', subcategory: 'peppers',
    price: 400,
    inventory: { quantity: 150, unit: 'kg', lowStockThreshold: 25 },
  },
  {
    name: 'Fresh Onions',
    description: 'Large, firm onions freshly harvested. Essential ingredient for everyday cooking.',
    category: 'vegetables', subcategory: 'onions',
    price: 350, featured: true,
    inventory: { quantity: 300, unit: 'kg', lowStockThreshold: 50 },
  },
  {
    name: 'Ugu (Pumpkin Leaves)',
    description: 'Fresh ugu pumpkin leaves, rich in iron and vitamins. Harvested daily from our farm.',
    category: 'vegetables', subcategory: 'leafy_greens',
    price: 300,
    inventory: { quantity: 80, unit: 'pieces', lowStockThreshold: 20 },
  },
  {
    name: 'Fresh Carrots',
    description: 'Sweet, crunchy carrots from our farm. High in beta-carotene and fibre.',
    category: 'vegetables', subcategory: 'root_vegetables',
    price: 450,
    inventory: { quantity: 120, unit: 'kg', lowStockThreshold: 20 },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // --- Admin user ---
    await User.deleteOne({ email: ADMIN.email });
    await User.create(ADMIN); // pre-save hook handles hashing
    console.log('Admin created:', ADMIN.email, '/ password:', ADMIN.password);

    // --- Products ---
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Skipping products — ${existingCount} already exist. Delete them in Atlas first to re-seed.`);
    } else {
      await Product.insertMany(PRODUCTS);
      console.log(`Created ${PRODUCTS.length} products`);
    }

    console.log('\nDone! You can now log in at:');
    console.log('  Email:    admin@torodofarms.com');
    console.log('  Password: admin123');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
