const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, notes, discount } = req.body;

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) continue;
            totalPrice += menuItem.price * item.quantity;
            orderItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
                image: menuItem.image,
            });
        }

        const deliveryFee = totalPrice > 300 ? 0 : 40;
        const discountAmt = discount || 0;
        const finalTotal = totalPrice + deliveryFee - discountAmt;

        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            deliveryAddress,
            notes,
            totalPrice: finalTotal,
            deliveryFee,
            discount: discountAmt,
            paymentMethod,
            statusHistory: [{ status: 'received', message: 'Order received by restaurant' }],
        });

        res.status(201).json({ success: true, order, message: 'Order placed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort('-createdAt');
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email phone').sort('-createdAt');
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, message } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.status = status;
        order.statusHistory.push({ status, message: message || `Order ${status}`, timestamp: new Date() });
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
