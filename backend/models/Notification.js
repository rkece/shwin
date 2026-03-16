const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['OrderPlaced', 'OrderConfirmed', 'OrderPreparing', 'OrderOutForDelivery', 'OrderDelivered', 'OrderCancelled', 'Offer', 'General'],
        required: true,
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    isRead: { type: Boolean, default: false },
    icon: { type: String, default: '🍽️' },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
