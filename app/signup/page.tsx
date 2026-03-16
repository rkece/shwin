'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import { register } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const { setUser } = useStore();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await register(formData);
            setUser(data.user, data.token);
            toast.success(`Welcome to the Inn, ${data.user.name}! 🌯`);
            router.push('/');
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
            toast.error(message);
            console.error('Signup Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row-reverse">

            {/* Right Side (imagery) */}
            <div className="hidden md:flex md:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1544378730-8b5104b18790?w=1200&q=80"
                    alt="Premium Ingredients"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A]" />

                <div className="absolute bottom-20 right-20 text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-white text-7xl font-bold leading-tight" style={{ fontFamily: 'Oswald' }}>
                            JOIN THE <br /> <span className="text-red-600">FAMILY.</span>
                        </h1>
                        <p className="text-white/40 mt-6 text-xl max-w-lg font-light ml-auto">
                            Your journey to the ultimate shawarma experience begins here. Sign up for rewards and faster checkout.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Left Side (form) */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">

                <Link href="/" className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold tracking-widest">
                    <ChevronLeft size={16} /> BACK TO HOME
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md py-20"
                >
                    <div className="mb-12">
                        <h2 className="text-white text-5xl font-bold mb-4" style={{ fontFamily: 'Oswald' }}>CREATE ACCOUNT</h2>
                        <p className="text-white/40">Become a member and enjoy exclusive benefits.</p>
                    </div>

                    <form onSubmit={handleSignup} className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="text" required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="email" required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                    <input
                                        type="tel" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                        placeholder="01234 56789"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                    <input
                                        type="password" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                        >
                            {loading ? "CREATING..." : (
                                <>SIGN UP <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center mt-12 text-white/30 text-sm">
                        Already a member? <Link href="/login" className="text-red-500 font-bold hover:underline">SIGN IN</Link>
                    </p>
                </motion.div>
            </div>

        </div>
    );
}
