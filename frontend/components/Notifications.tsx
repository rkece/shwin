'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, Package, Truck, AlertCircle } from 'lucide-react';
import useStore from '@/lib/store';
import { getNotifications, markAllNotificationsRead } from '@/lib/api';

const iconMap: Record<string, any> = {
    OrderPlaced: <Package className="text-blue-500" size={16} />,
    OrderConfirmed: <Check className="text-green-500" size={16} />,
    OrderPreparing: <Clock className="text-orange-500" size={16} />,
    OrderOutForDelivery: <Truck className="text-purple-500" size={16} />,
    OrderDelivered: <Check className="text-green-600" size={16} />,
    OrderCancelled: <AlertCircle className="text-red-500" size={16} />,
};

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useStore();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch { }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch { }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-full border border-white/20 text-white hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-[70]"
                        >
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Oswald' }}>Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="text-xs text-red-600 font-semibold hover:underline">
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <Bell className="mx-auto text-gray-200 mb-2" size={32} />
                                        <p className="text-gray-400 text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${!n.isRead ? 'bg-red-50/30' : ''}`}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {iconMap[n.type] || <Bell size={16} className="text-gray-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 leading-tight">{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            {!n.isRead && <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />}
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                <button
                                    onClick={() => { setIsOpen(false); }}
                                    className="text-xs font-bold text-gray-600 hover:text-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
