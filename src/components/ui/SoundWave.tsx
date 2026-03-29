/**
 * SoundWave Component
 * Animated SVG using Framer Motion for AI states
 * 
 * States:
 * - idle: Very low amplitude, slow oscillation, border color
 * - input: Gentle activation, slightly higher amplitude, muted color
 * - thinking: Medium amplitude, continuous fluid motion, ink at 30% opacity
 * - result: Wave recedes, fades gently over 0.5s
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type SoundWaveState = 'idle' | 'input' | 'thinking' | 'result';

interface SoundWaveProps {
  state: SoundWaveState;
  className?: string;
}

const stateConfig = {
  idle: {
    amplitude: 4,
    speed: 4,
    color: 'var(--border)', // #E8E4DC
    opacity: 1,
  },
  input: {
    amplitude: 8,
    speed: 3,
    color: 'var(--muted)', // #9B9590
    opacity: 1,
  },
  thinking: {
    amplitude: 12,
    speed: 1.5,
    color: 'var(--ink)', // #0F1416
    opacity: 0.3,
  },
  result: {
    amplitude: 0,
    speed: 2,
    color: 'var(--border)',
    opacity: 0,
  },
};

function generateWavePath(amplitude: number, phase: number): string {
  const points: string[] = [];
  const width = 200;
  const height = 40;
  const centerY = height / 2;
  const numPoints = 50;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * width;
    const y = centerY + Math.sin((i / numPoints) * Math.PI * 4 + phase) * amplitude;
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }

  return points.join(' ');
}

export function SoundWave({ state, className }: SoundWaveProps) {
  const config = stateConfig[state];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0 }}
        animate={{ opacity: config.opacity }}
        exit={{ opacity: 0 }}
        transition={{ duration: state === 'result' ? 0.5 : 0.3 }}
        className={cn('relative w-full h-10 overflow-hidden', className)}
      >
        <svg
          viewBox="0 0 200 40"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Multiple wave layers for depth */}
          {[0, 0.5, 1].map((offset, index) => (
            <motion.path
              key={index}
              fill="none"
              stroke={config.color}
              strokeWidth={1.5 - index * 0.3}
              strokeLinecap="round"
              initial={{ d: generateWavePath(0, 0) }}
              animate={{
                d: [
                  generateWavePath(config.amplitude * (1 - index * 0.2), 0),
                  generateWavePath(config.amplitude * (1 - index * 0.2), Math.PI),
                  generateWavePath(config.amplitude * (1 - index * 0.2), Math.PI * 2),
                ],
              }}
              transition={{
                d: {
                  duration: config.speed,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: offset,
                },
              }}
              style={{
                opacity: 1 - index * 0.3,
              }}
            />
          ))}
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}

export default SoundWave;
