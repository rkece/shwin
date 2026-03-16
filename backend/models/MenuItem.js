const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ['shawarma', 'wraps', 'plates', 'beverages', 'addons'],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
