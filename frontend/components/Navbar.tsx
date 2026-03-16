'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Bell, Flame } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/lib/store';
import Notifications from './Notifications';

const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'MENU', href: '/menu' },
    { label: 'ABOUT', href: '/about' },
    { label: 'ORDERS', href: '/my-orders' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const { user, logout, toggleCart, cartCount } = useStore();
    const count = cartCount();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        setUserDropdown(false);
        router.push('/');
    };

    return (
        <header className="nav-fixed-top">
            {/* Logo - Minimalist approach as requested (Removed text name) */}
            <Link href="/" className="nav-logo-container group">
                <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative w-14 h-14 flex items-center justify-center"
                >
                    <Image src="/logo.png" alt="S" fill className="object-contain" />
                </motion.div>
                <div className="flex flex-col ml-1">
                    <span className="text-xs text-red-600 tracking-[0.5em] font-black uppercase leading-none">INN</span>
                    <span className="text-[8px] text-white/40 tracking-[0.2em] uppercase font-bold mt-1.5">EST. 1998</span>
                </div>
            </Link>

            {/* Desktop Navigation - Strictly Centered */}
            <nav className="hidden lg:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-xs font-bold tracking-[0.3em] transition-all duration-500 relative group ${pathname === link.href ? 'text-red-600' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {link.label}
                        <span className={`absolute -bottom-2 left-0 h-[1px] bg-red-600 transition-all duration-500 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>
                ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-8">
                <Notifications />

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={toggleCart}
                    className="relative text-white/40 hover:text-white transition-colors"
                >
                    <ShoppingCart size={20} strokeWidth={1.5} />
                    {count > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                        >
                            {count}
                        </motion.span>
                    )}
                </motion.button>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdown(!userDropdown)}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-600 transition-colors">
                                <User size={16} className="text-white/60" />
                            </div>
                        </button>

                        <AnimatePresence>
                            {userDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-52 bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl z-[150]"
                                >
                                    <div className="px-6 py-4 border-b border-white/5">
                                        <p className="text-[10px] text-white/30 tracking-widest font-bold">SIGNED IN AS</p>
                                        <p className="text-xs font-bold text-white mt-1 truncate">{user.email}</p>
                                    </div>
                                    <Link href="/my-orders" className="block px-6 py-4 text-[10px] font-bold tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all">MY ORDERS</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="block px-6 py-4 text-[10px] font-bold tracking-widest text-red-500 hover:bg-red-500/5">ADMIN PANEL</Link>
                                    )}
                                    <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-[10px] font-bold tracking-widest text-red-600 border-t border-white/5 hover:bg-red-600/5">
                                        SIGN OUT
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="bg-white text-black px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl"
                        >
                            SIGN IN
                        </motion.button>
                    </Link>
                )}

                <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white/60 hover:text-white transition-colors">
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0A0A0A] z-[201] flex flex-col items-center justify-center text-center"
                    >
                        <div className="flex flex-col items-center gap-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-5xl font-bold tracking-[0.2em] text-white/40 hover:text-red-600 transition-colors uppercase"
                                    style={{ fontFamily: 'Oswald' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <button onClick={() => setMobileOpen(false)} className="absolute bottom-16 text-white/10 hover:text-white transition-colors">
                            <X size={40} strokeWidth={1} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
