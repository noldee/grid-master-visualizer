"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate 
} from 'framer-motion';

// --- Tipos de Motores Visuales ---
export type VisualEngine = "High-Tilt 3D" | "Perspective Soft" | "Magnetic Force" | "Ray-Cast Spotlight" | "None";

interface Props {
  columns?: number;
  gap?: string;
  animation?: VisualEngine;
  className?: string;
  children: React.ReactNode;
}

const GridItem = ({ children, animation }: { children: React.ReactNode, animation: VisualEngine }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Estados de movimiento
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configuración de resortes (Springs) para suavidad premium
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // --- ENGINE: TILT & PERSPECTIVE ---
  const isHighTilt = animation === "High-Tilt 3D";
  const isSoftTilt = animation === "Perspective Soft";
  const tiltRange = isHighTilt ? 35 : (isSoftTilt ? 12 : 0);

  const rotateX = useTransform(ySpring, [0, 1], [tiltRange, -tiltRange]);
  const rotateY = useTransform(xSpring, [0, 1], [-tiltRange, tiltRange]);

  // --- ENGINE: MAGNETIC ---
  const isMagnetic = animation === "Magnetic Force";
  const magX = useTransform(xSpring, [0, 1], [-25, 25]);
  const magY = useTransform(ySpring, [0, 1], [-25, 25]);

  // --- ENGINE: RAY-CAST SPOTLIGHT ---
  const isSpotlight = animation === "Ray-Cast Spotlight";
  // Usamos useMotionTemplate para que el gradiente se mueva a 120fps sin re-renders
  const backgroundLight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)`;
  const borderLight = useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.5), transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalización para Tilt/Magnetic
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);

    // Coordenadas exactas para Spotlight
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        rotateX: (isHighTilt || isSoftTilt || isSpotlight) ? rotateX : 0,
        rotateY: (isHighTilt || isSoftTilt || isSpotlight) ? rotateY : 0,
        x: isMagnetic ? magX : 0,
        y: isMagnetic ? magY : 0,
        zIndex: (isHighTilt || isMagnetic) ? 10 : 1
      }}
      className="group relative h-full w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500"
    >
      {/* Ray-Cast Border (La luz que brilla en el borde de 1px) */}
      {isSpotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{ background: borderLight }}
        />
      )}

      {/* Contenedor de contenido */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 p-6 z-10">
        
        {/* Ray-Cast Inner Light (El aura dentro de la tarjeta) */}
        {isSpotlight && (
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: backgroundLight }}
          />
        )}

        {/* Elevación Z del contenido (Pop-out effect) */}
        <div 
          style={{ 
            transform: (isHighTilt || isSoftTilt) ? "translateZ(50px)" : "none",
            transformStyle: "preserve-3d" 
          }} 
          className="relative h-full"
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const GridComponent = ({
  columns = 3,
  gap = "gap-6",
  animation = "High-Tilt 3D",
  className = "",
  children
}: Props) => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      className={`relative w-full ${className} ${animation !== "None" ? 'cursor-none' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom Global Cursor */}
      {animation !== "None" && (
        <motion.div
          className="fixed top-0 left-0 w-6 h-6 rounded-full border border-blue-500 bg-blue-500/10 pointer-events-none z-[9999] backdrop-blur-[2px]"
          animate={{
            x: cursorPos.x - 12,
            y: cursorPos.y - 12,
            scale: isHovering ? 1.4 : 0,
            opacity: isHovering ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Grid Engine */}
      <div 
        className={`grid ${gap}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {React.Children.map(children, (child) => (
          <GridItem animation={animation}>{child}</GridItem>
        ))}
      </div>
    </div>
  );
};