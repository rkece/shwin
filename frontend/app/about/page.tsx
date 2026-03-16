'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Flame, Shield, Heart, Star, ChefHat, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

const timeline = [
    { year: '2018', title: 'Founded in Thiruvottiyur', desc: 'Started as a small street stall with a big dream and a secret shawarma recipe.' },
    { year: '2019', title: 'First Restaurant', desc: 'Opened our first sit-in restaurant after overwhelming street success.' },
    { year: '2021', title: 'Expansion to 3 Branches', desc: 'Growing demand led us to open in Manali and Kolathur.' },
    { year: '2023', title: '4th Branch & Online Ordering', desc: 'Launched our Perambur outlet and started digital ordering platform.' },
    { year: '2024', title: '10,000 Happy Customers', desc: 'Reached a milestone of 10,000+ satisfied customers across North Chennai.' },
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <CartDrawer />

            {/* Hero */}
            <section className="relative pt-20 pb-0 min-h-[60vh] flex items-center bg-[#0A0A0A] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1920&q=80"
                        alt="Shawarma Kitchen"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 to-[#0A0A0A]" />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-red-400 text-xs tracking-widest uppercase font-semibold">Our Story</span>
                        <h1 className="text-white mt-3" style={{ fontFamily: 'Oswald', fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 700 }}>
                            Passion On A <span className="text-gradient-red">Plate</span>
                        </h1>
                        <p className="text-white/50 mt-5 text-xl max-w-2xl mx-auto leading-relaxed">
                            We are not just a restaurant. We are a love story between a chef and his shawarma.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <span className="section-tag">Who We Are</span>
                            <h2 className="section-title mt-1 mb-6">A Family Recipe,<br /><span>A City's Favourite</span></h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                Shawarma Inn was born out of a simple passion — bringing authentic Middle Eastern flavors to the streets of North Chennai. What started as a humble street-side stall in Thiruvottiyur in 2018 has now grown into a beloved chain with 4 outlets.
                            </p>
                            <p className="text-gray-500 leading-relaxed">
                                Every shawarma we make carries the same love and precision as that very first one. Our secret garlic sauce, handpicked spice blend, and fresh pita bread have made us a household name across the city.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative h-96 rounded-2xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80"
                                    alt="Kitchen"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-5 -left-5 bg-red-600 text-white p-5 rounded-2xl shadow-xl">
                                <p className="text-3xl font-bold" style={{ fontFamily: 'Oswald' }}>6+</p>
                                <p className="text-sm opacity-80">Years of Excellence</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It's Made */}
            <section className="bg-[#0A0A0A] py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
                        <span className="section-tag text-red-400">🌯 The Process</span>
                        <h2 style={{ fontFamily: 'Oswald', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, color: '#fff' }}>
                            How We Make Our <span className="text-gradient-red">Shawarma</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Fresh Marination', icon: Flame, desc: '12-hour marination in secret spice blend' },
                            { step: '02', title: 'Slow Rotisserie', icon: Clock, desc: 'Cooked on vertical rotisserie for 4 hours' },
                            { step: '03', title: 'Hand-Sliced', icon: ChefHat, desc: 'Perfectly sliced by expert shawarma chefs' },
                            { step: '04', title: 'Fresh Assembly', icon: Heart, desc: 'Assembled fresh with homemade sauces & veggies' },
                        ].map(({ step, title, icon: Icon, desc }, i) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.12 }}
                                className="text-center p-6 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            >
                                <div className="text-red-500 text-xs font-bold tracking-widest mb-4">{step}</div>
                                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Icon size={26} className="text-red-500" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Oswald' }}>{title}</h3>
                                <p className="text-white/40 text-sm">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="bg-white py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
                        <span className="section-tag">Our Journey</span>
                        <h2 className="section-title">From Street to <span>Stardom</span></h2>
                    </motion.div>
                    <div className="relative">
                        <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gray-100" />
                        {timeline.map(({ year, title, desc }, i) => (
                            <motion.div
                                key={year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-8 mb-10"
                            >
                                <div className="flex-shrink-0 w-32 text-right">
                                    <span className="text-red-600 font-bold text-lg" style={{ fontFamily: 'Oswald' }}>{year}</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow" />
                                    <h3 className="font-bold text-gray-900 text-base mb-1">{title}</h3>
                                    <p className="text-gray-500 text-sm">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hygiene Standards */}
            <section className="bg-[#0A0A0A] py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
                        <h2 style={{ fontFamily: 'Oswald', fontSize: '42px', fontWeight: 700, color: '#fff' }}>
                            Our <span className="text-gradient-red">Hygiene Standards</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Shield, label: 'FSSAI Certified', desc: 'Licensed & compliant kitchen' },
                            { icon: Star, label: '4.8 Hygiene Rating', desc: 'Consistently top-rated on Zomato' },
                            { icon: Heart, label: 'Daily Freshness', desc: 'Ingredients sourced every morning' },
                            { icon: ChefHat, label: 'Trained Staff', desc: 'Regular hygiene training & audits' },
                        ].map(({ icon: Icon, label, desc }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-5 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            >
                                <Icon size={28} className="text-red-500 mx-auto mb-3" />
                                <p className="text-white font-semibold text-sm mb-1">{label}</p>
                                <p className="text-white/40 text-xs">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
