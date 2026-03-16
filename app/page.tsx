'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, Mail, Users, Star, Flame, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Footer from '@/components/Footer';
import Magnetic from '@/components/Magnetic';
import TextReveal from '@/components/TextReveal';
import SoundToggle from '@/components/SoundToggle';
import Tilt from '@/components/Tilt';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'hero', title: 'HERO' },
  { id: 'kitchens', title: 'KITCHENS' },
  { id: 'signatures', title: 'SIGNATURES' },
  { id: 'community', title: 'COMMUNITY' },
  { id: 'contact', title: 'CONTACT' }
];

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.slide-panel');

      sections.forEach((section: any, i: number) => {
        if (i === 0) return;

        gsap.fromTo(section,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: () => `${i * 100}vh top`,
              end: () => `${(i + 1) * 100}vh top`,
              scrub: true,
              onToggle: self => self.isActive && setActiveIdx(i),
            }
          }
        );
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${(sections.length - 1) * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.floor(progress * sections.length);
          if (idx !== activeIdx && idx < sections.length) {
            setActiveIdx(idx);
          }
        }
      });

      setTimeout(() => ScrollTrigger.refresh(), 1000);
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div ref={mainRef} className="bg-[#0A0A0A] selection:bg-red-600 selection:text-white">
      <AnimatePresence>
        {showIntro && (
          <SplashScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
      
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-[200]"
        >
          <Navbar />
          <SoundToggle isMuted={isMuted} onToggle={toggleSound} />
        </motion.div>
      )}

      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-all duration-500 ${activeIdx === i ? 'bg-red-600 scale-[3] shadow-[0_0_10px_#ff0000]' : 'bg-white/20 scale-100'}`}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">

        {/* SECTION 1: HERO - HD VIDEO NO BLUR NO CAPTION */}
        <section className="slide-panel absolute inset-0 z-[10] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black pointer-events-none">
            {/* 
                "Virtual AI Eraser" Tech: 
                - scale-125 to zoom past captions
                - object-top to push captions off-screen at the bottom
                - opacity-100 for maximum HD clarity
            */}
            {!showIntro && (
              <video
                ref={videoRef}
                autoPlay loop muted playsInline
                className="w-full h-full object-cover object-top opacity-100 scale-125 filter contrast-125 brightness-110"
              >
                <source src="/videos/intro.mp4" type="video/mp4" />
              </video>
            )}
            {/* Clean subtle vignette for text legibility without blurring the video */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-[1]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 1.1, filter: "blur(20px)" }}
            animate={!showIntro ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="relative z-[20] text-center px-6"
          >
            <span className="text-red-600 font-bold tracking-[0.8em] text-xs uppercase block mb-6 drop-shadow-lg">SHAWARMA INN</span>
            <h1 className="text-7xl md:text-[10vw] font-bold tracking-tighter mb-8 text-white drop-shadow-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              <TextReveal text="THE HERITAGE" className="italic" />
            </h1>
            <Magnetic>
              <Link href="/menu">
                <button className="btn-premium bg-red-600 text-white px-16 py-8 rounded-full font-bold text-xs tracking-[0.4em] uppercase shadow-[0_30px_60px_-15px_rgba(204,26,26,0.3)] border border-white/10">
                  DISCOVER THE TASTE
                </button>
              </Link>
            </Magnetic>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={!showIntro ? { opacity: 0.6 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 text-white z-[20]"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={32} strokeWidth={1} />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: KITCHENS */}
        <section className="slide-panel absolute inset-0 z-[20] flex flex-col items-center justify-center bg-[#0A0A0A]">
          <div className="max-w-7xl w-full px-6 text-center">
            <h2 className="text-5xl md:text-8xl font-bold mb-20 tracking-tighter" style={{ fontFamily: 'Oswald' }}>THE KITCHENS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {['Mogappair', 'Anna Nagar', 'Nungambakkam'].map((loc, i) => (
                <Magnetic key={i}>
                    <Tilt className="p-12 border border-white/5 bg-white/5 rounded-[50px] hover:bg-white hover:text-black transition-all duration-500 shadow-2xl">
                    <MapPin className="mx-auto mb-6 text-red-600" size={40} />
                    <h3 className="text-2xl font-bold uppercase tracking-tight">{loc}</h3>
                    <p className="mt-2 text-xs tracking-widest opacity-40 uppercase font-black">Open Kitchen 24/7</p>
                  </Tilt>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SIGNATURES */}
        <section className="slide-panel absolute inset-0 z-[30] flex flex-col items-center justify-center bg-[#0A0A0A]">
          <div className="max-w-7xl w-full px-6">
            <h2 className="text-5xl md:text-8xl font-bold mb-16 tracking-tighter text-center" style={{ fontFamily: 'Oswald' }}>SIGNATURES</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: 'Rumali Special', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600' },
                { name: 'Fire Wrap', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600' },
                { name: 'Heritage Plate', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600' },
                { name: 'Garlic Blast', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600' }
              ].map((item, i) => (
                <Tilt key={i} className="aspect-[3/4] bg-white/5 rounded-[40px] border border-white/5 overflow-hidden group relative">
                  <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-white font-bold tracking-widest text-sm uppercase">{item.name}</p>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: COMMUNITY */}
        <section className="slide-panel absolute inset-0 z-[40] flex flex-col items-center justify-center bg-[#0A0A0A]">
          <div className="text-center px-6">
            <div className="mb-12">
              <Users className="mx-auto text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(204,26,26,0.5)]" size={80} />
              <h2 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-none" style={{ fontFamily: 'Oswald' }}>
                TRUSTED BY <br /> <span className="text-red-600 italic">THOUSANDS.</span>
              </h2>
            </div>
            <div className="flex gap-4 items-center justify-center text-red-500">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={24} />)}
            </div>
            <p className="mt-8 text-white/40 tracking-[0.4em] text-xs font-bold uppercase">5.0 Star Rated Cuisine</p>
          </div>
        </section>

        {/* SECTION 5: CONTACT */}
        <section className="slide-panel absolute inset-0 z-[50] flex flex-col bg-[#0A0A0A]">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <h2 className="text-5xl md:text-8xl font-bold mb-16 tracking-tighter" style={{ fontFamily: 'Oswald' }}>LET'S CONNECT</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <Magnetic>
                <button className="px-12 py-6 border border-white/10 rounded-full font-bold tracking-widest hover:bg-white hover:text-black transition-all bg-white/5">+91 98765 43210</button>
              </Magnetic>
              <Magnetic>
                <button className="px-12 py-6 border border-white/10 rounded-full font-bold tracking-widest hover:bg-white hover:text-black transition-all bg-white/5 uppercase">Email Support</button>
              </Magnetic>
            </div>
          </div>
          <Footer />
        </section>

      </div>

      <div style={{ height: `${(SECTIONS.length - 1) * 100}vh` }} />
    </div>
  );
}
