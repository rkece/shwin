'use client';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [isPointer, setIsPointer] = useState(false);
    const [cursorText, setCursorText] = useState("");

    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0)
    };

    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(mouse.x, smoothOptions);
    const smoothY = useSpring(mouse.y, smoothOptions);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x.set(e.clientX);
            mouse.y.set(e.clientY);

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');

            // Look for data-cursor attribute for contextual text
            const dataText = target.getAttribute('data-cursor');
            setCursorText(dataText || "");
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[10001] hidden md:block"
                style={{ x: mouse.x, y: mouse.y, translateX: '-50%', translateY: '-50%' }}
            />

            {/* Follower Circle */}
            <motion.div
                className="fixed top-0 left-0 w-16 h-16 border border-red-600/30 rounded-full pointer-events-none z-[10000] hidden md:block flex items-center justify-center overflow-hidden"
                style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                animate={{
                    scale: isPointer ? 3.5 : 1,
                    backgroundColor: isPointer ? 'rgba(204, 26, 26, 0.1)' : 'rgba(204, 26, 26, 0)',
                    borderColor: isPointer ? 'rgba(204, 26, 26, 0.5)' : 'rgba(204, 26, 26, 0.2)',
                }}
            >
                {cursorText && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 0.45 }}
                        className="text-xs font-bold text-white uppercase tracking-tighter text-center leading-none"
                    >
                        {cursorText}
                    </motion.span>
                )}
            </motion.div>
        </>
    );
}
