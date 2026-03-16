const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        itemName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1, min: 1 },
        imageURL: { type: String, default: '' },
        subtotal: { type: Number, default: 0 },
    }],
    totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-recalculate total before saving
cartSchema.pre('save', function () {
    this.totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.items.forEach(item => { item.subtotal = item.price * item.quantity; });
});

// Index for fast lookup by userId
cartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
