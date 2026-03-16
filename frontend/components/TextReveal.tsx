'use client';
import { motion } from 'framer-motion';

export default function TextReveal({ text, className = "" }: { text: string, className?: string }) {
    const characters = text.split("");

    return (
        <span className={`inline-block overflow-hidden ${className}`}>
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1,
                        delay: i * 0.02,
                        ease: [0.76, 0, 0.24, 1]
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}
