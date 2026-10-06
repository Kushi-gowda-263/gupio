import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

const SEED_USERS = [
  {
    name: 'Gupio Admin',
    email: 'admin@gupio.dev',
    password: 'Password123!',
    role: 'ADMIN',
  },
  {
    name: 'Sarah Staff',
    email: 'staff@gupio.dev',
    password: 'Password123!',
    role: 'STAFF',
  },
];

const SEED_PRODUCTS = [
  {
    name: 'MacBook Pro 16" M3 Max',
    sku: 'MBP-16-M3M-01',
    description: 'Apple Silicon M3 Max with 36GB unified memory, 1TB SSD storage, Liquid Retina XDR display.',
    category: 'Electronics',
    price: 3499.00,
    stockQuantity: 18,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dell UltraSharp 32" 4K Monitor',
    sku: 'DEL-U32-4K-02',
    description: 'PremierColor 4K HDR IPS monitor with USB-C 90W power delivery and ultra-thin bezels.',
    category: 'Electronics',
    price: 899.50,
    stockQuantity: 24,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'SNY-WH5-BLK-03',
    description: 'Industry-leading noise canceling with dual processor V1, 30-hour battery life, and crystal clear calls.',
    category: 'Electronics',
    price: 398.00,
    stockQuantity: 42,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    sku: 'LOG-MX3S-GRY-04',
    description: 'Ergonomic performance wireless mouse with 8K DPI any-surface sensor and quiet clicks.',
    category: 'Electronics',
    price: 99.99,
    stockQuantity: 6, // Low Stock (1-10)
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    sku: 'KEY-Q1P-WHT-05',
    description: '75% layout QMK/VIA wireless mechanical keyboard with CNC aluminum body and hot-swappable switches.',
    category: 'Electronics',
    price: 199.00,
    stockQuantity: 0, // Out of Stock
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Herman Miller Aeron Ergonomic Chair',
    sku: 'HM-AER-CH-06',
    description: 'PostureFit SL supportive ergonomic office chair with breathable Pellicle suspension and forward tilt.',
    category: 'Furniture',
    price: 1395.00,
    stockQuantity: 12,
    image: 'https://images.unsplash.com/photo-1580481077195-c99026388e6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Jarvis Bamboo Electric Standing Desk',
    sku: 'JRV-STD-DK-07',
    description: 'Dual-motor electric height adjustable standing desk with eco-friendly solid bamboo desktop 60x30".',
    category: 'Furniture',
    price: 749.00,
    stockQuantity: 4, // Low Stock (1-10)
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Modern Oak Bookshelf 5-Tier',
    sku: 'OAK-BSH-5T-08',
    description: 'Solid European white oak modular shelving system with concealed wall anchor hardware.',
    category: 'Furniture',
    price: 480.00,
    stockQuantity: 0, // Out of Stock
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Merino Wool Minimalist Crewneck',
    sku: 'MRN-WL-CN-09',
    description: '100% ultrafine Australian merino wool sweater, thermoregulating and odor-resistant.',
    category: 'Clothing',
    price: 125.00,
    stockQuantity: 35,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Waterproof Technical Commuter Jacket',
    sku: 'WTR-PRF-JK-10',
    description: '3-layer breathable waterproof shell with taped seams, magnetic storm flap, and reflective accents.',
    category: 'Clothing',
    price: 245.00,
    stockQuantity: 8, // Low Stock
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Leather Executive Desk Pad 36x20',
    sku: 'LTH-DSK-PD-11',
    description: 'Full-grain vegetable-tanned leather desk mat with non-slip suede underside and pen rest channel.',
    category: 'Office Supplies',
    price: 85.00,
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Aluminum Cable Management Spine',
    sku: 'ALM-CBL-MGT-12',
    description: 'Articulating magnetic cable vertebrae channel for height adjustable desks.',
    category: 'Office Supplies',
    price: 49.00,
    stockQuantity: 2, // Low Stock
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');

    // Seed Users (update or create)
    console.log('Seeding users...');
    for (const u of SEED_USERS) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
        console.log(` Created user: ${u.email} (${u.role})`);
      } else {
        // Reset password and role if needed
        existing.name = u.name;
        existing.role = u.role;
        existing.password = u.password;
        await existing.save();
        console.log(` Updated user: ${u.email} (${u.role})`);
      }
    }

    // Seed Products if none or replace
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database empty. Inserting seed products...');
      await Product.insertMany(SEED_PRODUCTS);
      console.log(` Inserted ${SEED_PRODUCTS.length} seed products.`);
    } else {
      console.log(` Database already contains ${count} products.`);
      // Check if we have sample products
      const sampleCheck = await Product.findOne({ sku: 'MBP-16-M3M-01' });
      if (!sampleCheck) {
        console.log('Inserting seed products...');
        for (const p of SEED_PRODUCTS) {
          await Product.findOneAndUpdate({ sku: p.sku }, p, { upsert: true, new: true });
        }
        console.log(` Upserted ${SEED_PRODUCTS.length} demo products.`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
