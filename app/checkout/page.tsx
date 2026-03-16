'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Phone, CreditCard, Smartphone, Building2, Truck, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import useStore from '@/lib/store';
import { createOrder } from '@/lib/api';
import toast from 'react-hot-toast';

const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: <Smartphone size={20} />, desc: 'PhonePe, GPay, Paytm' },
    { id: 'card', label: 'Card', icon: <CreditCard size={20} />, desc: 'Credit / Debit Card' },
    { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={20} />, desc: 'All major banks' },
    { id: 'cod', label: 'Cash on Delivery', icon: <Truck size={20} />, desc: 'Pay when delivered' },
];

export default function CheckoutPage() {
    const { cart, user, cartTotal, clearCart } = useStore();
    const total = cartTotal();
    const deliveryFee = total > 300 ? 0 : 40;
    const finalTotal = total + deliveryFee;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [address, setAddress] = useState({
        street: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '',
        phone: user?.phone || '',
    });
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        if (cart.length === 0 && !success) { router.push('/menu'); }
    }, [user, cart, router, success]);

    const handlePlaceOrder = async () => {
        if (!address.street || !address.pincode || !address.phone) {
            toast.error('Please fill in all delivery details');
            return;
        }
        if (address.pincode.length !== 6) {
            toast.error('Enter a valid 6-digit pincode');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
                deliveryAddress: address,
                notes,
                paymentMethod,
            };
            const response = await createOrder(orderData);
            setOrderId(response.data.order.orderId);
            clearCart();
            setSuccess(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Order failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle size={48} className="text-green-400" />
                    </motion.div>
                    <h1 className="text-white text-4xl font-bold mb-3" style={{ fontFamily: 'Oswald' }}>Order Placed! 🎉</h1>
                    <p className="text-white/60 mb-2">Order ID: <span className="text-red-400 font-mono font-bold">{orderId}</span></p>
                    <p className="text-white/50 text-sm mb-8">
                        Our team will confirm your order shortly.<br />
                        You can track your order in My Orders.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/my-orders">
                            <motion.button whileHover={{ scale: 1.05 }} className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold">
                                Track Order
                            </motion.button>
                        </Link>
                        <Link href="/menu">
                            <motion.button whileHover={{ scale: 1.05 }} className="border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/5">
                                Order More
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <Link href="/menu" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Oswald' }}>Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left: Delivery + Payment */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Delivery Address */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <MapPin className="text-red-600" size={20} /> Delivery Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm font-medium mb-1.5">Street Address *</label>
                                        <input
                                            type="text" required
                                            placeholder="House No., Street, Area"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-gray-800 transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1.5">City *</label>
                                            <input
                                                type="text" value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 text-sm font-medium mb-1.5">Pincode *</label>
                                            <input
                                                type="text" maxLength={6} required
                                                placeholder="600019"
                                                value={address.pincode}
                                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-sm font-medium mb-1.5">Phone *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="tel" required
                                                placeholder="10-digit phone"
                                                value={address.phone}
                                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-sm font-medium mb-1.5">Special Instructions (optional)</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Any notes for the restaurant..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <CreditCard className="text-red-600" size={20} /> Payment Method
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethods.map((method) => (
                                        <motion.button
                                            key={method.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === method.id
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className={paymentMethod === method.id ? 'text-red-600' : 'text-gray-500'}>{method.icon}</span>
                                            <div>
                                                <p className={`text-sm font-semibold ${paymentMethod === method.id ? 'text-red-700' : 'text-gray-800'}`}>{method.label}</p>
                                                <p className="text-gray-400 text-xs">{method.desc}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                {paymentMethod === 'upi' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                                        <input
                                            type="text" placeholder="Enter UPI ID (e.g. name@paytm)"
                                            value={upiId} onChange={(e) => setUpiId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 outline-none transition-all"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={item.image || '/food/default.jpg'} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span><span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                                            {deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total</span><span>₹{finalTotal}</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full mt-5 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><Lock size={16} /> Place Order (₹{finalTotal})</>
                                    )}
                                </motion.button>
                                <p className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
                                    <Lock size={10} /> Secured & encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
