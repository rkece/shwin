const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalOrders, todayOrders, pendingOrders, totalUsers, totalMenuItems, allOrders] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({ status: { $in: ['received', 'confirmed', 'preparing'] } }),
            User.countDocuments({ role: 'customer' }),
            MenuItem.countDocuments(),
            Order.find({ status: 'delivered' }).select('totalPrice createdAt'),
        ]);

        const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);

        // Weekly sales
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(day.getDate() - i);
            day.setHours(0, 0, 0, 0);
            const nextDay = new Date(day);
            nextDay.setDate(nextDay.getDate() + 1);
            const orders = await Order.find({ createdAt: { $gte: day, $lt: nextDay } }).select('totalPrice');
            last7Days.push({
                date: day.toLocaleDateString('en-IN', { weekday: 'short' }),
                revenue: orders.reduce((s, o) => s + o.totalPrice, 0),
                orders: orders.length,
            });
        }

        res.json({ success: true, stats: { totalOrders, todayOrders, pendingOrders, totalUsers, totalMenuItems, totalRevenue, weeklySales: last7Days } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Seed initial menu
router.post('/seed-menu', protect, adminOnly, async (req, res) => {
    try {
        const existing = await MenuItem.countDocuments();
        if (existing > 0) return res.json({ success: true, message: 'Menu already seeded' });

        const menuItems = [
            { name: 'Classic Chicken Shawarma', category: 'shawarma', description: 'Juicy chicken strips marinated in Arabic spices, wrapped in soft pita with garlic sauce', price: 120, isPopular: true, isFeatured: true, tags: ['bestseller', 'chicken'], image: '/food/chicken-shawarma.jpg' },
            { name: 'Beef Shawarma', category: 'shawarma', description: 'Tender beef slices with Middle Eastern spices, hummus and fresh veggies', price: 150, isFeatured: true, tags: ['beef', 'premium'], image: '/food/beef-shawarma.jpg' },
            { name: 'Paneer Shawarma', category: 'shawarma', description: 'Grilled paneer cubes with tandoori masala, served with mint chutney', price: 110, isFeatured: true, tags: ['veg', 'paneer'], image: '/food/paneer-shawarma.jpg' },
            { name: 'Arabian Special Shawarma', category: 'shawarma', description: 'Our signature recipe with double meat, premium sauces and Arabic pickles', price: 180, isPopular: true, isFeatured: true, tags: ['special', 'bestseller'], image: '/food/arabian-shawarma.jpg' },
            { name: 'Egg Shawarma', category: 'shawarma', description: 'Masala egg filling with crispy veggies and tangy mayo', price: 90, tags: ['egg', 'budget'], image: '/food/egg-shawarma.jpg' },
            { name: 'Chicken Wrap', category: 'wraps', description: 'Crispy chicken with fresh lettuce, tomatoes and chipotle sauce', price: 130, isPopular: true, tags: ['chicken', 'wrap'], image: '/food/chicken-wrap.jpg' },
            { name: 'Veggie Wrap', category: 'wraps', description: 'Grilled vegetables with hummus and tzatziki sauce', price: 100, tags: ['veg', 'healthy'], image: '/food/veggie-wrap.jpg' },
            { name: 'Beef Wrap', category: 'wraps', description: 'Marinated beef strips with caramelized onions and garlic aioli', price: 160, tags: ['beef', 'premium'], image: '/food/beef-wrap.jpg' },
            { name: 'Shawarma Plate', category: 'plates', description: 'Full plate with rice, shawarma, hummus, salad and pita bread', price: 200, isPopular: true, tags: ['full meal', 'rice'], image: '/food/shawarma-plate.jpg' },
            { name: 'Combo Plate', category: 'plates', description: 'Half chicken + half beef shawarma with sides', price: 250, tags: ['combo', 'premium'], image: '/food/combo-plate.jpg' },
            { name: 'Fresh Lemon Mint', category: 'beverages', description: 'Fresh squeezed lemon with mint leaves and sugar syrup', price: 60, tags: ['cold', 'fresh'], image: '/food/lemon-mint.jpg' },
            { name: 'Jaljeera', category: 'beverages', description: 'Tangy jeera-spiced chilled drink', price: 50, tags: ['cold', 'spiced'], image: '/food/jaljeera.jpg' },
            { name: 'Mango Lassi', category: 'beverages', description: 'Thick Alphonso mango blended with chilled yogurt', price: 70, isPopular: true, tags: ['cold', 'lassi'], image: '/food/mango-lassi.jpg' },
            { name: 'Extra Garlic Sauce', category: 'addons', description: 'Creamy homemade garlic sauce', price: 20, tags: ['sauce'], image: '/food/garlic-sauce.jpg' },
            { name: 'Extra Pita Bread', category: 'addons', description: 'Freshly baked pita bread', price: 15, tags: ['bread'], image: '/food/pita.jpg' },
        ];

        await MenuItem.insertMany(menuItems);
        res.json({ success: true, message: 'Menu seeded successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
