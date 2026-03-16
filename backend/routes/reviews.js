const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// GET all approved reviews
router.get('/', async (req, res) => {
    try {
        const { menuItemId, limit = 20 } = req.query;
        const query = { isApproved: true };
        if (menuItemId) query.menuItemId = menuItemId;
        const reviews = await Review.find(query).sort('-createdAt').limit(Number(limit));
        res.json({ success: true, reviews });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST create review
router.post('/', protect, async (req, res) => {
    try {
        const { rating, comment, menuItemId, orderId, platform } = req.body;
        const review = await Review.create({
            userId: req.user._id,
            userName: req.user.name,
            rating, comment, menuItemId, orderId,
            platform: platform || 'website',
        });
        res.status(201).json({ success: true, review });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: approve/delete review
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, review });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Review deleted' });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
