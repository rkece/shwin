'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, MessageSquare, Clock, Flame, ShieldCheck, ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { getMenuItems } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function MenuItemDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useStore();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await getMenuItems(); // Usually we'd have getMenuItemById, but for now filtering
                const found = res.data.items.find((i: any) => i._id === id);
                if (found) setItem(found);
                else router.push('/menu');
            } catch (err) {
                toast.error('Failed to load item');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id, router]);

    const handleAddToCart = () => {
        if (!item) return;
        addToCart({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity,
            image: item.image || item.imageURL || '/food/default.jpg',
        });
        toast.success(`${item.name} added to cart!`);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!item) return null;

    return (
        <>
            <Navbar />
            <CartDrawer />

            <main className="bg-white min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link href="/menu" className="hover:text-red-600 transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium">{item.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group"
                        >
                            <Image
                                src={item.image || item.imageURL || 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80'}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {item.isPopular && (
                                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Flame size={12} fill="currentColor" /> POPULAR
                                    </span>
                                )}
                                {item.category === 'shawarma' && (
                                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                        <Star size={12} fill="currentColor" /> Bestseller
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Info Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <div className="mb-2">
                                <span className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase">{item.category}</span>
                            </div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Oswald' }}>
                                {item.name}
                            </h1>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={18} className={i <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-500">(4.8 / 5.0)</span>
                                </div>
                                <div className="w-px h-6 bg-gray-200" />
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock size={18} />
                                    <span className="text-sm font-medium">10 - 15 mins</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-10">
                                {item.description || "Our signature shawarma, prepared with the finest ingredients and our secret spice blend. Every bite is a journey of authentic Middle Eastern flavors."}
                            </p>

                            <div className="flex items-end gap-2 mb-10">
                                <span className="text-4xl font-bold text-gray-900">₹{item.price}</span>
                                <span className="text-gray-400 line-through mb-1">₹{item.price + 40}</span>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded ml-2 mb-1.5">SAVE 20%</span>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap items-center gap-6 mb-12">
                                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-500"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-red-600"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gradient-to-r from-red-700 to-red-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:shadow-red-200 hover:-translate-y-1 active:scale-95"
                                >
                                    <ShoppingCart size={22} />
                                    ADD TO CART
                                </button>
                            </div>

                            {/* Badges */}
                            <div className="grid grid-cols-2 gap-4 py-8 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Fresh & Hygienic</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">Zero Preservatives</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Details Tabs */}
                    <div className="mt-20 border-t border-gray-100 pt-12">
                        <div className="flex gap-10 mb-10 border-b border-gray-100 pb-4">
                            {['description', 'reviews', 'nutrition'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-lg font-bold capitalize transition-all relative ${activeTab === tab ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    style={{ fontFamily: 'Oswald' }}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="tabLine" className="absolute -bottom-[17px] left-0 right-0 h-1 bg-red-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'description' && (
                                <motion.div
                                    key="desc"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-3xl text-gray-600 leading-relaxed text-lg"
                                >
                                    <p className="mb-6">
                                        Indulge in the perfect blend of spice and succulence. Our {item.name} is marinated for 12 hours in a secret blend of Middle Eastern spices, slow-cooked to perfection, and served fresh.
                                    </p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-5">
                                        <li>100% Halal Certified Meat</li>
                                        <li>Sourced from local farms daily</li>
                                        <li>Homemade signature tahini sauce</li>
                                        <li>Freshly baked pita bread</li>
                                        <li>Organic garden vegetables</li>
                                        <li>Zero artificial colors</li>
                                    </ul>
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { name: 'Arun Kumar', rating: 5, date: '2 days ago', text: 'Literally the best shawarma in Perambur. The garlic sauce is magic!' },
                                            { name: 'Priya S.', rating: 4, date: '1 week ago', text: 'Large portion and very fresh. Could be a bit spicier but loved it.' },
                                            { name: 'Vijay R.', rating: 5, date: '3 days ago', text: 'I order this almost every weekend. Consistent quality always.' },
                                        ].map((rev, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="font-bold text-gray-900">{rev.name}</p>
                                                    <span className="text-xs text-gray-400">{rev.date}</span>
                                                </div>
                                                <div className="flex gap-1 mb-3">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className={s <= rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />)}
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed italic">"{rev.text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-8 text-red-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        WRITE A REVIEW <ChevronRight size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </>
    );
}
