import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundProps {
  isInteracting?: boolean;
  scrollProgress: number;
}

export function Background({ isInteracting, scrollProgress }: BackgroundProps) {
  const isDynamic = scrollProgress > 0.3;
  const transitionProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 3));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f5f5] opacity-[0.02]" />
      
      {/* Static architectural pattern */}
      <motion.div 
        className="absolute inset-0"
        style={{
          opacity: isDynamic ? 0.01 : 0.03,
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0',
          transition: 'opacity 0.5s ease-out',
        }}
      />

      {/* Dynamic pattern */}
      <AnimatePresence>
        {isDynamic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: transitionProgress * 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  animate={{
                    x: [
                      Math.random() * window.innerWidth,
                      Math.random() * window.innerWidth,
                    ],
                    y: [
                      Math.random() * window.innerHeight,
                      Math.random() * window.innerHeight,
                    ],
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    filter: 'blur(1px)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-rose-900/10 mix-blend-overlay"
        style={{
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
}

// Add this to your global CSS file (src/index.css)
const style = document.createElement('style');
style.textContent = `
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}
`;
document.head.appendChild(style);