const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, adminOnly } = require('../middleware/auth');

// GET active offers
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({ status: 'active', validFrom: { $lte: now }, validTo: { $gte: now } });
        res.json({ success: true, offers });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST validate coupon code
router.post('/validate', protect, async (req, res) => {
    try {
        const { couponCode, orderAmount } = req.body;
        const now = new Date();
        const offer = await Offer.findOne({ couponCode: couponCode.toUpperCase(), status: 'active', validFrom: { $lte: now }, validTo: { $gte: now } });
        if (!offer) return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
        if (orderAmount < offer.minOrderAmount) {
            return res.status(400).json({ success: false, message: `Minimum order amount is ₹${offer.minOrderAmount}` });
        }
        let discount = 0;
        if (offer.discountType === 'percentage') {
            discount = Math.min((orderAmount * offer.discountValue) / 100, offer.maxDiscountAmount);
        } else {
            discount = offer.discountValue;
        }
        res.json({ success: true, offer, discount: Math.floor(discount), message: `Coupon applied! You save ₹${Math.floor(discount)}` });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin CRUD
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json({ success: true, offer });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, offer });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Offer deleted' });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
