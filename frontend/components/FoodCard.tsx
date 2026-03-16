import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Star, Flame } from 'lucide-react';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

interface FoodCardProps {
    item: {
        _id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        imageURL?: string;
        isPopular?: boolean;
        rating?: number;
        category: string;
    };
    dark?: boolean;
}

export default function FoodCard({ item, dark = false }: FoodCardProps) {
    const { addToCart, toggleCart } = useStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image || item.imageURL || '',
        });
        toast.success(`${item.name} added to cart! 🎉`);
    };

    return (
        <Link href={`/menu/${item._id}`}>
            <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer border transition-all duration-500 ${dark
                    ? 'border-white/10 hover:border-red-500/40 bg-dark-700'
                    : 'border-gray-100 hover:border-red-200 bg-white hover:shadow-2xl hover:shadow-red-100'
                    }`}
            >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    <Image
                        src={item.image || item.imageURL || `https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80`}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Badge */}
                    {item.isPopular && (
                        <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-lg z-10">
                            <Flame size={12} fill="currentColor" /> TRENDING
                        </span>
                    )}

                    {/* Quick add on hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                            <Plus size={16} /> Add to Cart
                        </button>
                    </motion.div>
                </div>

                {/* Content */}
                <div className={`p-6 text-center ${dark ? 'bg-dark-700' : ''}`}>
                    <div className="flex flex-col items-center mb-4">
                        <span className="text-xs text-red-600 font-bold tracking-[0.2em] mb-2 uppercase">{item.category}</span>
                        <h3 className={`font-bold text-2xl leading-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Oswald' }}>
                            {item.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className={i <= (item.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-white/10"} />)}
                        </div>
                    </div>
                    <p className={`text-sm leading-relaxed mb-6 line-clamp-2 max-w-[240px] mx-auto ${dark ? 'text-white/40' : 'text-gray-600'}`}>
                        {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-red-600 font-bold text-xl">₹{item.price}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="md:hidden bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 transition-colors"
                        >
                            <Plus size={14} /> Add
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="hidden md:flex bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold px-4 py-2 rounded-full items-center gap-1 transition-all duration-300 border border-red-200 hover:border-transparent"
                        >
                            <Plus size={14} /> Add to Cart
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
