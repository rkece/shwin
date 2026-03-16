const mongoose = require('mongoose');

// OrderItems is embedded in Order, but this standalone model
// allows for detailed per-item querying (analytics, returns, etc.)
const orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    orderIdRef: { type: String }, // like "SI20240315001"
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    itemName: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
}, { timestamps: true });

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ menuItemId: 1 });

module.exports = mongoose.model('OrderItem', orderItemSchema);
