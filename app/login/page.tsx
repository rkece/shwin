'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import useStore from '@/lib/store';
import { login } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useStore();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login({ email, password });
            setUser(data.user, data.token);
            toast.success(`Welcome back, ${data.user.name}!`);
            router.push(data.user.role === 'admin' ? '/admin' : '/');
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Email or password incorrect';
            toast.error(message);
            console.error('Login Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row">

            {/* Left Side: Brand Imagery */}
            <div className="hidden md:flex md:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1200&q=80"
                    alt="Premium Shawarma"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]" />

                <div className="absolute bottom-20 left-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-white text-7xl font-bold leading-tight" style={{ fontFamily: 'Oswald' }}>
                            RECOVER THE <br /> <span className="text-red-600">MAGIC.</span>
                        </h1>
                        <p className="text-white/40 mt-6 text-xl max-w-lg font-light">
                            Sign in to access your saved addresses, exclusive rewards, and the freshest flavors in town.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">

                <Link href="/" className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold tracking-widest">
                    <ChevronLeft size={16} /> BACK TO HOME
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h2 className="text-white text-5xl font-bold mb-4" style={{ fontFamily: 'Oswald' }}>SIGN IN</h2>
                        <p className="text-white/40">Enter your credentials to continue your journey.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase">Password</label>
                                <Link href="#" className="text-xs text-red-600 font-bold hover:underline">FORGOT?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-red-600 transition-all outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 mt-10 disabled:opacity-50"
                        >
                            {loading ? "AUTHENTICATING..." : (
                                <>SIGN IN <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center mt-12 text-white/30 text-sm">
                        Don't have an account? <Link href="/signup" className="text-red-500 font-bold hover:underline">REGISTER NOW</Link>
                    </p>
                </motion.div>
            </div>

        </div>
    );
}
