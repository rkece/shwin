'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('hold'), 800);
        const t2 = setTimeout(() => setPhase('exit'), 2200);
        const t3 = setTimeout(() => onComplete(), 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== 'exit' ? (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center flex-col gap-6"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative w-36 h-36"
                    >
                        <Image
                            src="/logo.png"
                            alt="Shawarma Inn Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </motion.div>

                    {/* Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center"
                    >
                        <h1
                            className="text-white text-5xl font-bold tracking-widest uppercase"
                            style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.15em' }}
                        >
                            Shawarma Inn
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-red-500 text-sm tracking-[0.3em] uppercase mt-1"
                        >
                            Tempting Taste
                        </motion.p>
                    </motion.div>

                    {/* Loading bar */}
                    <motion.div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4">
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-700 to-red-400 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                        />
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
