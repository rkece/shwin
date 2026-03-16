'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    UtensilsCrossed, 
    Users, 
    Settings, 
    LogOut, 
    Menu as MenuIcon, 
    X, 
    Bell,
    ExternalLink,
    Search,
    ChevronRight
} from 'lucide-react';
import useStore from '@/lib/store';
import Image from 'next/image';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Live Orders', icon: ShoppingBag },
    { href: '/admin/menu', label: 'Menu Editor', icon: UtensilsCrossed },
    { href: '/admin/customers', label: 'Customer Base', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useStore();

    useEffect(() => {
        setMounted(true);
        if (!user || user.role !== 'admin') {
            router.push('/login');
        }
    }, [user, router]);

    if (!mounted || !user || user.role !== 'admin') return null;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-red-100 selection:text-red-900">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="bg-white border-r border-slate-200 h-screen sticky top-0 z-50 overflow-hidden flex flex-col shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]"
            >
                <div className="w-[280px] h-full flex flex-col">
                    {/* Header */}
                    <div className="h-20 flex items-center px-8 border-b border-slate-100">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                                <Image src="/logo.png" alt="S" width={24} height={24} className="invert brightness-0" />
                            </div>
                            <div>
                                <h1 className="text-slate-900 font-bold tracking-tight text-lg leading-tight uppercase" style={{ fontFamily: 'Oswald' }}>
                                    SHAWARMA <span className="text-red-600">INN</span>
                                </h1>
                                <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Control Center</p>
                            </div>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-8 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-red-500' : 'group-hover:text-red-500 transition-colors'} />
                                    {item.label}
                                    {isActive && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-6 border-t border-slate-100 space-y-4">
                        <Link href="/" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-red-50 transition-colors">
                            <span className="text-xs font-bold text-slate-500 group-hover:text-red-600 transition-colors uppercase tracking-widest">Public Store</span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-red-600 transition-colors" />
                        </Link>
                        
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-10 h-10 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-md text-slate-600 font-bold uppercase">
                                {user.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate uppercase">{user.name.split(' ')[0]}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admin</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Wrapper */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
                        </button>
                        
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-6 text-sm text-slate-900 focus:ring-2 focus:ring-red-500/20 w-80 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            System Active
                        </div>
                        <div className="w-px h-6 bg-slate-200 mx-2" />
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-slate-600">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-10 custom-scrollbar bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
