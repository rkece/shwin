'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';
import { getMenuItems } from '@/lib/api';

const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'shawarma', label: 'SHAWARMA' },
    { id: 'wraps', label: 'WRAPS' },
    { id: 'plates', label: 'PLATES' },
    { id: 'beverages', label: 'DRINKS' },
];

function SkeletonCard() {
    return (
        <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/5 h-[400px] animate-pulse">
            <div className="h-52 bg-white/5" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
                <div className="h-8 bg-white/5 rounded w-3/4 mx-auto" />
                <div className="h-10 bg-white/5 rounded-full w-full mt-8" />
            </div>
        </div>
    );
}

export default function MenuPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchItems = async (category: string, search: string) => {
        setLoading(true);
        try {
            const params: any = {};
            if (category !== 'all') params.category = category;
            if (search) params.search = search;
            const response = await getMenuItems(params);
            setItems(response.data.items || []);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(activeCategory, searchQuery);
    }, [activeCategory]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchItems(activeCategory, searchQuery);
    };

    return (
        <div className="bg-[#0A0A0A] min-h-screen text-white">
            <Navbar />
            <CartDrawer />

            {/* Premium Header */}
            <section className="relative pt-40 pb-24 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1920&q=80"
                        alt="Menu"
                        fill
                        className="object-cover opacity-20 filter grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-red-600 text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Crafted Flavors</span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ fontFamily: 'Oswald' }}>
                            THE <span className="text-red-600">MENU</span>
                        </h1>
                        <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Discover the art of hand-carved perfection. Every item is a testament to our heritage spice blends.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Centered Search & Filter */}
                <div className="flex flex-col items-center mb-16 space-y-10">

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="SEARCH FOR FLAVORS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:border-red-600 transition-all outline-none text-center"
                        />
                        <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-600">
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Category Selection */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.3em] transition-all duration-500 border ${activeCategory === cat.id
                                        ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-900/20'
                                        : 'bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </motion.div>
                    ) : items.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 border border-dashed border-white/5 rounded-[40px]">
                            <ShoppingBag className="mx-auto text-white/10 mb-6" size={60} strokeWidth={1} />
                            <p className="text-white/40 text-xs tracking-[0.2em] font-bold">NO FLAVORS FOUND</p>
                            <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }} className="mt-6 text-red-600 font-bold text-sm underline underline-offset-4">RESET FILTERS</button>
                        </motion.div>
                    ) : (
                        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {items.map((item, i) => (
                                <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                                    <FoodCard item={item} dark={true} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}

import Image from 'next/image';
