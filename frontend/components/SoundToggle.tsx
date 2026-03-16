'use client';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SoundToggle({ isMuted, onToggle }: { isMuted: boolean, onToggle: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="fixed bottom-10 right-10 z-[100] w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md group overflow-hidden"
        >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </div>
        </motion.button>
    );
}
