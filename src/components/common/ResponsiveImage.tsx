import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  ratio?: 'square' | 'photo' | 'wide' | 'hero';
  priority?: boolean;
  width?: number;
  height?: number;
}

const ratioClass: Record<string, string> = {
  square: 'aspect-square',
  photo: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
  hero: 'aspect-[16/9]',
};

export function ResponsiveImage({
  src,
  alt,
  className,
  ratio = 'wide',
  priority = false,
  width,
  height,
}: ResponsiveImageProps) {
  return (
    <div className={cn('overflow-hidden bg-muted', ratioClass[ratio], className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
      />
    </div>
  );
}
