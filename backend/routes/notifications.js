const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');

// GET user's notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort('-createdAt').limit(30);
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
        res.json({ success: true, notifications, unreadCount });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH mark as read
router.patch('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.patch('/:id/read', protect, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: send notification to user
router.post('/send', protect, adminOnly, async (req, res) => {
    try {
        const { userId, title, message, type, orderId } = req.body;
        const notification = await Notification.create({ userId, title, message, type, orderId });
        res.status(201).json({ success: true, notification });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
