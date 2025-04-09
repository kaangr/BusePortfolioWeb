import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Measurement {
  id: number;
  x: number;
  y: number;
  value: number;
}

export function RulerCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastClickRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsClicking(true);
        const distance = Math.sqrt(
          Math.pow(e.clientX - lastClickRef.current.x, 2) +
          Math.pow(e.clientY - lastClickRef.current.y, 2)
        );

        if (lastClickRef.current.x !== 0 || lastClickRef.current.y !== 0) {
          const measurement: Measurement = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            value: distance / 20, // Convert pixels to cm (approximate)
          };
          setMeasurements(prev => [...prev, measurement]);
        }

        lastClickRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Clean up old measurements
  useEffect(() => {
    const cleanup = () => {
      setMeasurements(prev => prev.filter(m => Date.now() - m.id < 2000));
    };
    const interval = setInterval(cleanup, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Ruler cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50"
        animate={{ 
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="drop-shadow-glow">
            {/* Ruler body */}
            <rect x="2" y="6" width="20" height="12" rx="1" fill="rgba(255, 255, 255, 0.1)" />
            <rect x="2" y="6" width="20" height="12" rx="1" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
            
            {/* Measurement marks */}
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1={6 + i * 3}
                  y1="6"
                  x2={6 + i * 3}
                  y2="18"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="0.5"
                />
                <text
                  x={5.5 + i * 3}
                  y="11"
                  fontSize="3"
                  fill="rgba(255, 255, 255, 0.5)"
                >
                  {i * 5}
                </text>
              </React.Fragment>
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Measurement displays */}
      <AnimatePresence>
        {measurements.map((measurement) => (
          <motion.div
            key={measurement.id}
            className="fixed pointer-events-none z-40 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white/90 border border-white/20"
            style={{ 
              left: measurement.x,
              top: measurement.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.8, y: measurement.y - 10 }}
            animate={{ opacity: 1, scale: 1, y: measurement.y - 20 }}
            exit={{ opacity: 0, scale: 0.8, y: measurement.y - 10 }}
            transition={{ duration: 0.2 }}
          >
            {measurement.value.toFixed(1)} cm
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hide default cursor */}
      <style>{`
        body { cursor: none !important; }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 3px rgba(147, 197, 253, 0.5));
        }
      `}</style>
    </>
  );
} 