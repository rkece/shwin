'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Clock, 
    CheckCircle2, 
    Truck, 
    Ban, 
    ChefHat, 
    MapPin, 
    Phone,
    Copy,
    ExternalLink
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/api';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { icon: any, color: string, label: string }> = {
    received: { icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Received' },
    confirmed: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Confirmed' },
    preparing: { icon: ChefHat, color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'In Kitchen' },
    out_for_delivery: { icon: Truck, color: 'text-violet-600 bg-violet-50 border-violet-100', label: 'On Road' },
    delivered: { icon: CheckCircle2, color: 'text-slate-600 bg-slate-50 border-slate-100', label: 'Delivered' },
    cancelled: { icon: Ban, color: 'text-rose-600 bg-rose-50 border-rose-100', label: 'Cancelled' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data.orders || []);
        } catch {
            toast.error('Failed to sync orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await updateOrderStatus(id, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            toast.success(`Order status → ${status.replace('_', ' ')}`);
        } catch {
            toast.error('Update failed');
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             o.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || o.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Oswald' }}>LIVE ORDERS</h1>
                    <p className="text-slate-400 font-medium mt-1">Manage incoming and active orders from your kitchen.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadOrders} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        Refresh Queue
                    </button>
                    <div className="bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-red-200 cursor-default">
                        {orders.filter(o => ['received', 'confirmed', 'preparing'].includes(o.status)).length} Active
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
                    {['all', 'received', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                activeFilter === f 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search IDs or Customers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reference</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Items (Qty)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Revenue</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logistics</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-10"><div className="h-4 bg-slate-50 rounded-full w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredOrders.map((order) => {
                                const cfg = statusConfig[order.status] || statusConfig.received;
                                return (
                                    <motion.tr 
                                        layout
                                        key={order._id} 
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-black text-red-600 text-sm">#{order.orderId}</span>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded text-slate-400"><Copy size={12} /></button>
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="font-bold text-slate-900 leading-tight mb-1">{order.userId?.name || 'GUEST USER'}</div>
                                            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase">
                                                <span className="flex items-center gap-1"><Phone size={10} /> {order.userId?.phone || 'No Phone'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1.5">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between gap-4">
                                                        <span className="text-xs font-semibold text-slate-600 line-clamp-1">{item.name}</span>
                                                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="text-lg font-bold text-slate-900">₹{order.totalPrice}</div>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{order.paymentMethod}</div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest ${cfg.color}`}>
                                                <cfg.icon size={14} />
                                                {cfg.label}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-100 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                                            >
                                                {Object.keys(statusConfig).map(st => (
                                                    <option key={st} value={st}>{st.replace('_', ' ').toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredOrders.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No matching orders</h3>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
