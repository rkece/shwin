'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getMyOrders } from '@/lib/api';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';

const statusConfig: Record<string, { label: string; color: string; icon: any; step: number }> = {
    received: { label: 'Order Received', color: 'text-blue-600', icon: Package, step: 1 },
    confirmed: { label: 'Confirmed', color: 'text-yellow-600', icon: CheckCircle, step: 2 },
    preparing: { label: 'Preparing', color: 'text-orange-500', icon: Clock, step: 3 },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-600', icon: Truck, step: 4 },
    delivered: { label: 'Delivered', color: 'text-green-600', icon: CheckCircle, step: 5 },
    cancelled: { label: 'Cancelled', color: 'text-red-600', icon: Package, step: 0 },
};

function OrderStatusTracker({ status }: { status: string }) {
    const steps = ['received', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentStep = statusConfig[status]?.step || 0;

    return (
        <div className="flex items-center justify-between relative mt-4 mb-2">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <motion.div
                className="absolute top-4 left-0 h-0.5 bg-red-600 z-0"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(0, ((currentStep - 1) / 4) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {steps.map((step, i) => {
                const config = statusConfig[step];
                const Icon = config.icon;
                const isActive = i < currentStep;
                const isCurrent = i + 1 === currentStep;
                return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                        <motion.div
                            animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-red-600 border-red-600' : isCurrent ? 'bg-red-100 border-red-600' : 'bg-white border-gray-200'
                                }`}
                        >
                            <Icon size={14} className={isActive ? 'text-white' : isCurrent ? 'text-red-600' : 'text-gray-400'} />
                        </motion.div>
                        <p className={`text-[10px] mt-2 font-medium text-center leading-tight max-w-[60px] ${isActive || isCurrent ? 'text-red-600' : 'text-gray-400'
                            }`}>
                            {config.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() => { }).finally(() => setLoading(false));
    }, [user, router]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Oswald' }}>My Orders</h1>
                    <p className="text-gray-500 mb-8">Track and manage your orders</p>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                                    <div className="h-3 bg-gray-100 rounded w-2/3 mb-6" />
                                    <div className="h-2 bg-gray-100 rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag size={60} className="text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                            <p className="text-gray-400 mb-6">Place your first order and experience our delicious shawarma!</p>
                            <Link href="/menu">
                                <motion.button whileHover={{ scale: 1.05 }} className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold">
                                    Browse Menu
                                </motion.button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, i) => {
                                const status = statusConfig[order.status] || statusConfig.received;
                                const Icon = status.icon;
                                return (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="p-5 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">Order #{order.orderId}</p>
                                                    <p className="text-gray-400 text-sm mt-0.5">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-1.5 text-sm font-semibold ${status.color}`}>
                                                    <Icon size={16} />
                                                    {status.label}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Tracker */}
                                        {order.status !== 'cancelled' && (
                                            <div className="px-5 py-4">
                                                <OrderStatusTracker status={order.status} />
                                            </div>
                                        )}

                                        {/* Items & Total */}
                                        <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod.toUpperCase()}</p>
                                                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                                                    {order.items.map((i: any) => i.name).join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-lg">₹{order.totalPrice}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
