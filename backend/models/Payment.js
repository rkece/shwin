const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderIdRef: { type: String },           // human-readable order ID like "SI20240315001"
    paymentMethod: {
        type: String,
        enum: ['upi', 'netbanking', 'card', 'cod'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionId: { type: String, default: null },
    paymentGateway: { type: String, default: 'simulation' }, // razorpay / stripe / simulation
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    upiId: { type: String, default: null },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
