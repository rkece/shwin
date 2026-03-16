const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerTitle: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    couponCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true },   // % or flat ₹ amount
    maxDiscountAmount: { type: Number, default: 200 }, // cap for percentage discounts
    minOrderAmount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: null },       // null = unlimited
    usageCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
    applicableCategories: [String],  // empty = all categories
    bannerImage: { type: String, default: '' },
}, { timestamps: true });

offerSchema.index({ couponCode: 1 });
offerSchema.index({ status: 1, validTo: 1 });

module.exports = mongoose.model('Offer', offerSchema);
