'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Edit3, 
    Trash2, 
    Image as ImageIcon, 
    Flame, 
    Star, 
    ChevronDown,
    MoreVertical,
    Save,
    X,
    LayoutGrid,
    List,
    RefreshCw
} from 'lucide-react';
import { getMenuItems, seedMenu, updateMenuItem, deleteMenuItem } from '@/lib/api';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function MenuManagementPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        setLoading(true);
        try {
            const res = await getMenuItems();
            setItems(res.data.items || []);
        } catch {
            toast.error('Sync failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedMenu();
            toast.success('Menu populated with defaults');
            loadMenu();
        } catch {
            toast.error('Seeding failed');
        } finally {
            setIsSeeding(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Archive "${name}"?`)) return;
        try {
            await deleteMenuItem(id);
            setItems(prev => prev.filter(i => i._id !== id));
            toast.success('Item archived');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20 px-2 lg:px-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Oswald' }}>CATALOGUE</h1>
                    <p className="text-slate-400 font-medium mt-1">Refine your flavors and manage your offerings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSeed} 
                        disabled={isSeeding}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSeeding ? <RefreshCw className="animate-spin" size={16} /> : <Plus size={16} />} 
                        Auto-Seed
                    </button>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:scale-105 transition-all flex items-center gap-2">
                        <Plus size={18} /> Add New Item
                    </button>
                </div>
            </div>

            {/* Utility Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search recipes, categories, or keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-[20px] py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-red-500/20 transition-all shadow-inner"
                    />
                </div>
                
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                        <LayoutGrid size={20} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Content Display */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <div key="loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[32px] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" : "flex flex-col gap-4"}
                    >
                        {filteredItems.map((item) => (
                            <motion.div 
                                layout
                                key={item._id}
                                className={viewMode === 'grid' 
                                    ? "group bg-white rounded-[40px] border border-slate-100 p-4 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
                                    : "bg-white rounded-3xl border border-slate-100 p-4 flex items-center gap-6 group hover:shadow-lg transition-all"
                                }
                            >
                                <div className={viewMode === 'grid' ? "relative h-64 w-full rounded-[30px] overflow-hidden mb-6" : "relative h-20 w-20 rounded-2xl overflow-hidden shrink-0"}>
                                    <Image 
                                        src={item.image || item.imageURL || 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80'} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    {item.isPopular && (
                                        <div className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded-xl shadow-lg">
                                            <Flame size={16} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{item.category}</span>
                                            <h3 className="text-xl font-bold text-slate-900 truncate" style={{ fontFamily: 'Oswald' }}>{item.name}</h3>
                                        </div>
                                        <div className="text-lg font-black text-slate-900">₹{item.price}</div>
                                    </div>
                                    
                                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-6 font-medium">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                        <button className="flex-1 bg-slate-50 text-slate-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                            Quick Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id, item.name)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
