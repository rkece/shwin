'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useStore from '@/lib/store';

export default function CartDrawer() {
    const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useStore();
    const total = cartTotal();
    const deliveryFee = total > 300 ? 0 : 40;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="cart-overlay"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="cart-drawer"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-red-400" size={22} />
                                <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Oswald' }}>
                                    Your Cart
                                </h2>
                                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                    {cart.length}
                                </span>
                            </div>
                            <button onClick={closeCart} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)]">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-white/40">
                                    <ShoppingBag size={48} className="mb-4 opacity-30" />
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm mt-1">Add some delicious shawarmas!</p>
                                    <button onClick={closeCart} className="mt-4 text-red-400 text-sm hover:underline">
                                        Browse Menu →
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || '/food/default.jpg'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white text-sm font-semibold truncate">{item.name}</h4>
                                                <p className="text-red-400 text-sm font-bold mt-0.5">₹{item.price}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-white text-sm font-bold w-5 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-white/30 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <p className="text-white font-bold text-sm">₹{item.price * item.quantity}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-white/60 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60 text-sm">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    {deliveryFee === 0 && (
                                        <p className="text-green-400 text-xs">🎉 Free delivery on orders above ₹300!</p>
                                    )}
                                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span>₹{total + deliveryFee}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" onClick={closeCart}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-900/30"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={18} />
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
