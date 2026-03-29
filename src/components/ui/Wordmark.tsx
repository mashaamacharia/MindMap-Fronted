import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Inverted colors (charcoal on ecru vs default) */
  inverted?: boolean;
  /** Whether to show the logo next to the text */
  showLogo?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl',
};

const logoSizes = {
  sm: 48,
  md: 64,
  lg: 96,
};

/**
 * Wordmark component
 * Renders M1NDMAP11 brand wordmark
 */
export function Wordmark({ size = 'md', inverted = false, showLogo = false, className }: WordmarkProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLogo && (
        <div className="relative overflow-hidden rounded-sm">
          <Image
            src="/images/logo.jpg"
            alt="M1NDMAP11 Logo"
            width={logoSizes[size]}
            height={logoSizes[size]}
            className="object-contain"
          />
        </div>
      )}
      <span
        className={cn(
          'wordmark',
          sizeClasses[size],
          inverted ? 'text-ecru bg-charcoal px-3 py-1' : 'text-charcoal'
        )}
      >
        M1NDMAP11
      </span>
    </div>
  );
}

export default Wordmark;
