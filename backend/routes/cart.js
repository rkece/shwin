const express = require('express');
const router = express.Router();

// Cart is handled client-side in localStorage/Zustand
// This endpoint is for cart validation
router.post('/validate', async (req, res) => {
    const MenuItem = require('../models/MenuItem');
    try {
        const { items } = req.body;
        let total = 0;
        const validItems = [];
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (menuItem && menuItem.isAvailable) {
                total += menuItem.price * item.quantity;
                validItems.push({ ...item, price: menuItem.price, name: menuItem.name });
            }
        }
        res.json({ success: true, total, items: validItems, deliveryFee: total > 300 ? 0 : 40 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
