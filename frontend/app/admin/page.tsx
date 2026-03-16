'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ShoppingBag, 
    Users, 
    DollarSign, 
    Clock, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    UtensilsCrossed,
    Package
} from 'lucide-react';
import { getAdminStats } from '@/lib/api';
import toast from 'react-hot-toast';

function MetricCard({ title, value, subtext, icon: Icon, trend, color }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-4xl font-bold text-slate-900 leading-none" style={{ fontFamily: 'Oswald' }}>{value}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-tighter">{subtext}</p>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await getAdminStats();
            setStats(res.data.stats);
        } catch {
            toast.error('Sync failed');
        } finally {
            setLoading(false);
        }
    };

    const maxRevenue = Math.max(...(stats?.weeklySales?.map((s: any) => s.revenue) || [1]));

    return (
        <div className="space-y-10 pb-20">
            {/* Greeting Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-bold text-slate-900 tracking-tighter" style={{ fontFamily: 'Oswald' }}>
                        SYSTEM OVERVIEW
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">Real-time performance analytics and operational health.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
                    <button className="px-6 py-2.5 bg-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">Daily</button>
                    <button className="px-6 py-2.5 text-slate-400 text-xs font-black uppercase tracking-widest">Monthly</button>
                    <button className="px-6 py-2.5 text-slate-400 text-xs font-black uppercase tracking-widest">Yearly</button>
                </div>
            </div>

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[40px] animate-pulse" />)
                ) : (
                    <>
                        <MetricCard 
                            title="Total Revenue" 
                            value={`₹${stats?.totalRevenue?.toLocaleString()}`} 
                            subtext="Lifetime earnings" 
                            icon={DollarSign} 
                            trend={12} 
                            color="bg-slate-900"
                        />
                        <MetricCard 
                            title="Live Orders" 
                            value={stats?.totalOrders} 
                            subtext="Cumulative count" 
                            icon={ShoppingBag} 
                            trend={5} 
                            color="bg-red-600 shadow-red-100"
                        />
                        <MetricCard 
                            title="Member Base" 
                            value={stats?.totalUsers} 
                            subtext="Verified customers" 
                            icon={Users} 
                            trend={8} 
                            color="bg-indigo-600 shadow-indigo-100"
                        />
                        <MetricCard 
                            title="Queue Status" 
                            value={stats?.pendingOrders} 
                            subtext="Orders awaiting prep" 
                            icon={Clock} 
                            color="bg-amber-500 shadow-amber-100"
                        />
                    </>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: 'Oswald' }}>Revenue Velocity</h2>
                            <p className="text-white/40 text-xs font-bold tracking-widest mt-1 uppercase">Last 7 Culinary Cycles</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-red-500" style={{ fontFamily: 'Oswald' }}>₹{stats?.weeklySales?.[6]?.revenue?.toLocaleString() || 0}</p>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Today's Intake</p>
                        </div>
                    </div>

                    {/* Chart Visual */}
                    <div className="h-64 flex items-end gap-6 relative z-10">
                        {stats?.weeklySales?.map((day: any, i: number) => {
                            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black shadow-xl">
                                        ₹{day.revenue}
                                    </div>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(10, height)}%` }}
                                        transition={{ duration: 1, type: 'spring', delay: i * 0.1 }}
                                        className={`w-full max-w-[40px] rounded-2xl shadow-lg transition-all ${i === 6 ? 'bg-red-600 shadow-red-600/20' : 'bg-white/10 group-hover:bg-white/20'}`}
                                    />
                                    <span className="text-[10px] font-bold text-white/20 group-hover:text-white transition-colors mt-4 uppercase tracking-widest">{day.date}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Glowing Accent */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="bg-white rounded-[50px] border border-slate-100 p-10 flex flex-col shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-8" style={{ fontFamily: 'Oswald' }}>Catalog Stats</h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-slate-100 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Menu Items</p>
                                    <p className="text-xl font-bold text-slate-900">{stats?.totalMenuItems}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-slate-100 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Kitchen Capacity</p>
                                    <p className="text-xl font-bold text-slate-900">Optimal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-slate-100 text-slate-600 py-5 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                        Upgrade System
                    </button>
                </div>
            </div>
        </div>
    );
}
