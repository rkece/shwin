const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001'
    ],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Shawarma Inn API running',
        timestamp: new Date().toISOString(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// ===== MONGODB CONNECTION + INIT =====
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'shawarma_inn_db',
            family: 4
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);

        // Ensure indexes exist
        await createIndexes();

        // Create admin user if none exists
        const User = require('./models/User');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL || 'admin@shawarmainn.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                phone: '9999999999',
                role: 'admin',
            });
            console.log('✅ Admin user created → admin@shawarmainn.com / Admin@123');
        }
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        process.exit(1);
    }
};

// ===== INDEX CREATION =====
const createIndexes = async () => {
    try {
        const User = require('./models/User');
        const MenuItem = require('./models/MenuItem');
        const Order = require('./models/Order');
        const Payment = require('./models/Payment');
        const Review = require('./models/Review');
        const Notification = require('./models/Notification');
        const Offer = require('./models/Offer');
        const Cart = require('./models/Cart');

        // Users
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ role: 1 });

        // Menu
        await MenuItem.collection.createIndex({ category: 1 });
        await MenuItem.collection.createIndex({ isPopular: 1 });
        await MenuItem.collection.createIndex({ isFeatured: 1 });
        await MenuItem.collection.createIndex({ name: 'text', description: 'text' }); // text search

        // Orders
        await Order.collection.createIndex({ userId: 1 });
        await Order.collection.createIndex({ status: 1 });
        await Order.collection.createIndex({ createdAt: -1 });
        await Order.collection.createIndex({ orderId: 1 }, { unique: true, sparse: true });

        // Payments
        await Payment.collection.createIndex({ orderId: 1 });
        await Payment.collection.createIndex({ userId: 1 });

        // Reviews
        await Review.collection.createIndex({ menuItemId: 1 });
        await Review.collection.createIndex({ rating: -1 });

        // Notifications
        await Notification.collection.createIndex({ userId: 1, isRead: 1 });

        // Offers
        await Offer.collection.createIndex({ couponCode: 1 }, { unique: true });

        // Cart
        await Cart.collection.createIndex({ userId: 1 }, { unique: true });

        console.log('✅ Database indexes created');
    } catch (err) {
        console.log('ℹ️  Indexes already exist or:', err.message);
    }
};

// ===== START SERVER =====
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Shawarma Inn API → http://localhost:${PORT}`);
            console.log(`📖 Health Check → http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('SERVER FAILED TO START:', err.message);
        process.exit(1);
    }
};

startServer();
