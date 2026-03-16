'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Light Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-t from-red-600/10 via-transparent to-transparent"
                    />

                    <div className="relative overflow-hidden">
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <h1
                                className="text-4xl md:text-6xl text-white leading-none whitespace-nowrap"
                                style={{
                                    fontFamily: 'Pacifico, cursive',
                                    textShadow: '0 0 20px rgba(255, 0, 0, 0.6)'
                                }}
                            >
                                Shawarma <span className="italic">inn</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ delay: 1, duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-0 bg-[#0A0A0A] origin-right"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-6 flex flex-col items-center gap-3"
                    >
                        <div className="h-[1px] w-12 bg-red-600/30" />
                        <p className="text-red-500 font-bold tracking-[0.6em] text-[8px] uppercase" style={{ fontFamily: 'Oswald' }}>
                            Authentic Heritage
                        </p>
                    </motion.div>

                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5, ease: "linear" }}
                            className="h-full bg-red-600 shadow-[0_0_10px_#ff0000]"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
