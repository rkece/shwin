'use client';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const socials = [
        { icon: Instagram, href: '#', color: '#E1306C', label: 'Instagram' },
        { icon: Facebook, href: '#', color: '#1877F2', label: 'Facebook' },
        { icon: Twitter, href: '#', color: '#1DA1F2', label: 'Twitter' },
        { icon: Mail, href: '#', color: '#EA4335', label: 'Email' },
    ];

    return (
        <footer className="bg-[#0A0A0A]/95 border-t border-white/5 py-12 px-6 w-full mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                {/* Social Icons with brand-specific hover colors */}
                <div className="flex gap-12 mb-10">
                    {socials.map((social, i) => (
                        <motion.a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{
                                scale: 1.3,
                                color: social.color,
                                filter: `drop-shadow(0 0 8px ${social.color}80)`
                            }}
                            className="text-white/30 transition-all duration-300"
                            aria-label={social.label}
                        >
                            <social.icon size={26} strokeWidth={1.5} />
                        </motion.a>
                    ))}
                </div>

                {/* Bottom Metadata Bar */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[11px] tracking-[0.3em] text-white/40 gap-8">
                    <div className="font-bold flex gap-10 uppercase">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>

                    <div className="flex items-center gap-3 font-bold group cursor-default">
                        <MapPin size={12} className="text-red-600 group-hover:animate-bounce" />
                        <span className="group-hover:text-white transition-colors uppercase">HQ: Chennai, India</span>
                    </div>

                    <p className="font-bold uppercase select-none">
                        © 2024 Shawarma Inn • Handcrafted Traditions
                    </p>
                </div>
            </div>
        </footer>
    );
}
