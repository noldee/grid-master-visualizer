import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- Interfaces ---
interface Props {
  columns?: number;
  gap?: string;
  animate?: "float" | "perspective" | "slide" | "magnetic" | "spotlight" | "3d-tilt";
  className?: string;
  children: React.ReactNode;
}

interface ItemProps {
  children: React.ReactNode;
  animate: string;
}

// --- Componente de Item Individual (Gestiona su propia física) ---
const GridItem = ({ children, animate }: ItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Valores de movimiento del mouse (-0.5 a 0.5)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Resortes físicos (Springs) para suavizado tipo Apple/GSAP
  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Transformaciones para efectos 3D
  const rotateX = useTransform(ySpring, [0, 1], [animate === "3d-tilt" ? 30 : 15, animate === "3d-tilt" ? -30 : -15]);
  const rotateY = useTransform(xSpring, [0, 1], [animate === "3d-tilt" ? -30 : -15, animate === "3d-tilt" ? 30 : 15]);
  
  // Transformaciones para efecto Magnético
  const translateX = useTransform(xSpring, [0, 1], [-25, 25]);
  const translateY = useTransform(ySpring, [0, 1], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
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
        perspective: 1000,
        rotateX: ["perspective", "3d-tilt", "spotlight"].includes(animate) ? rotateX : 0,
        rotateY: ["perspective", "3d-tilt", "spotlight"].includes(animate) ? rotateY : 0,
        x: animate === "magnetic" ? translateX : 0,
        y: animate === "magnetic" ? translateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`grid-modern-item group relative overflow-hidden transition-colors duration-500`}
    >
      {/* Efecto Spotlight con Gradient dinámico */}
      {animate === "spotlight" && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [xSpring, ySpring],
              ([latestX, latestY]) => 
                `radial-gradient(600px circle at ${Number(latestX) * 100}% ${Number(latestY) * 100}%, rgba(99, 102, 241, 0.15), transparent 40%)`
            ),
          }}
        />
      )}
      
      {/* Contenido con elevación Z */}
      <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// --- Componente Principal del Grid ---
export const GridComponent = ({
  columns = 3,
  gap = "gap-6",
  animate = "perspective",
  className = "",
  children
}: Props) => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  // Seguimiento de cursor global para el Custom Cursor
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      className={`relative ${["magnetic", "spotlight", "3d-tilt", "perspective"].includes(animate) ? 'cursor-none' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom Cursor con React */}
      {["magnetic", "spotlight", "3d-tilt", "perspective"].includes(animate) && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full bg-blue-500/50 pointer-events-none z-[9999] mix-blend-difference"
          animate={{
            x: cursorPos.x - 16,
            y: cursorPos.y - 16,
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 1 : 0
          }}
          transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
        />
      )}

      <div className={`grid grid-cols-1 md:grid-cols-${columns} ${gap} ${className}`}>
        {React.Children.map(children, (child) => (
          <GridItem animate={animate}>{child}</GridItem>
        ))}
      </div>
    </div>
  );
};