const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
    }],
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true },
    },
    notes: { type: String, default: '' },
    totalPrice: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    discount: { type: Number, default: 0 },
    paymentMethod: {
        type: String,
        enum: ['upi', 'netbanking', 'card', 'cod'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    status: {
        type: String,
        enum: ['received', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'received',
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        message: String,
    }],
    estimatedTime: { type: Number, default: 30 }, // minutes
    orderId: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function () {
    if (!this.orderId) {
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        const count = await mongoose.model('Order').countDocuments();
        this.orderId = `SI${dateStr}${(count + 1).toString().padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);
