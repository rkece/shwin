'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Search, 
    Mail, 
    Phone, 
    Calendar, 
    ChevronRight, 
    CreditCard,
    ShoppingBag,
    Star
} from 'lucide-react';
import { getUsers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CustomersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data.users || []);
        } catch {
            toast.error('Sync failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Oswald' }}>CUSTOMER BASE</h1>
                    <p className="text-slate-400 font-medium mt-1">Insight into your audience and their preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 cursor-default">
                        {users.length} Registered Members
                    </div>
                </div>
            </div>

            {/* Utility Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by name, email or UID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-slate-50 rounded-[40px] animate-pulse" />
                    ))
                ) : filteredUsers.map((u) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={u._id}
                        className="group bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
                    >
                        {/* Role Badge */}
                        <div className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-slate-300">
                            {u.role}
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-red-100 group-hover:rotate-12 transition-transform">
                                {u.name[0]}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 truncate uppercase tracking-tight" style={{ fontFamily: 'Oswald' }}>{u.name}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">LOYALTY MEMBER</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <Mail size={16} className="text-slate-300" />
                                {u.email}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                <Phone size={16} className="text-slate-300" />
                                {u.phone || 'Blocked/Private'}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={14} className="text-slate-300" />
                                Joined {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-red-600 transition-colors">
                                View History <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && filteredUsers.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[60px]">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={32} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Zero matches</h3>
                    <p className="text-slate-400 mt-2">No customers found for your search criteria.</p>
                </div>
            )}
        </div>
    );
}
