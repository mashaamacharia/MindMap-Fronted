/**
 * SoundWave Component
 * High-performance animated 3D ribbon SVG using Framer Motion
 * 
 * States:
 * - idle: Very low amplitude, slow fluid motion
 * - input: Gentle activation, slightly higher amplitude
 * - thinking: Full amplitude, wide sweeping continuous fluid motion
 * - result: Wave recedes and fades out
 */

'use client';

import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useMemo } from 'react';

type SoundWaveState = 'idle' | 'input' | 'thinking' | 'result';

interface SoundWaveProps {
  state: SoundWaveState;
  className?: string;
}

const stateConfig = {
  idle: {
    baseAmplitude: 23,
    speed: 0.001,
    opacity: 0.6,
  },
  input: {
    baseAmplitude: 40,
    speed: 0.002,
    opacity: 0.8,
  },
  thinking: {
    baseAmplitude: 60,
    speed: 0.003,
    opacity: 1,
  },
  result: {
    baseAmplitude: 0,
    speed: 0.002,
    opacity: 0,
  },
};

export function SoundWave({ state, className }: SoundWaveProps) {
  const config = stateConfig[state];
  const pathsRef = useRef<SVGPathElement[]>([]);
  
  // Track continuous amplitude so transitions are buttery smooth without unmounting
  const currentAmpRef = useRef(config.baseAmplitude);
  
  const width = 700;
  const height = 150; // Taller viewBox mapped to the same CSS height for more wave room
  const centerY = height / 2;
  const numPoints = 80;
  const numLayers = 20;

  // Render loop using framer-motion's performant useAnimationFrame
  useAnimationFrame((time) => {
    // Smoothly interpolate amplitude to target over time
    currentAmpRef.current += (config.baseAmplitude - currentAmpRef.current) * 0.05;
    
    if (!pathsRef.current.length) return;

    for (let index = 0; index < numLayers; index++) {
      const pathElement = pathsRef.current[index];
      if (!pathElement) continue;

      const layerProgress = index / (numLayers - 1); // 0 to 1
      
      const points: string[] = [];
      
      // Global time base
      const t = time * config.speed;
      
      // The 3D ribbon effect comes from shifting the phase slightly per layer
      const layerShift = (layerProgress - 0.5) * 1.5;

      for (let i = 0; i <= numPoints; i++) {
        const progress = i / numPoints; // 0 to 1
        const x = progress * width;
        
        // Envelope: 0 at edges, 1 in center. Keeps the ribbon tied at the ends.
        const envelope = Math.sin(progress * Math.PI);

        // Frequencies for interference
        const freq1 = 2; // Primary sweep
        const freq2 = 3.5; // Secondary ripples

        const wave1 = Math.sin(progress * Math.PI * freq1 + t + layerShift);
        const wave2 = Math.cos(progress * Math.PI * freq2 + t * 1.3 + layerShift * 1.2);
        
        // Combine waves and apply current amplitude
        const rawY = (wave1 + wave2 * 0.4) * currentAmpRef.current;
        
        // Vertical shift based on layer index provides the "thickness" of the ribbon
        const yOffset = (layerProgress - 0.5) * currentAmpRef.current * 0.8;
        
        const y = centerY + (rawY + yOffset) * envelope;
        points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
      }

      pathElement.setAttribute('d', points.join(' '));
    }
  });

  // Calculate distinct opacities so the center layers glow the brightest
  const layerOpacities = useMemo(() => {
    return Array.from({ length: numLayers }).map((_, index) => {
      const progress = index / (numLayers - 1);
      // Bell curve opacity peaking at 0.4, tailing to 0.1 at edges
      return 0.05 + Math.sin(progress * Math.PI) * 0.35;
    });
  }, [numLayers]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: config.opacity }}
        transition={{ duration: 0.8 }}
        className={cn('relative w-full overflow-hidden', className)}
        style={{ height: '140px' }} // CSS height to handle tall waves
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Smooth linear gradient mapping Cyan -> Blue -> Purple -> Pink */}
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="20%" stopColor="#4facfe" />
              <stop offset="50%" stopColor="#a18cd1" />
              <stop offset="80%" stopColor="#fbc2eb" />
              <stop offset="100%" stopColor="#ffb199" />
            </linearGradient>
          </defs>
          
          {Array.from({ length: numLayers }).map((_, index) => (
            <path
              key={index}
              ref={(el) => {
                if (el) pathsRef.current[index] = el;
              }}
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="mix-blend-screen"
              style={{ opacity: layerOpacities[index] }}
            />
          ))}
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}

export default SoundWave;
