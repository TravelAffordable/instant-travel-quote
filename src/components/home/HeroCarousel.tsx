import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HolidaySearch } from '@/components/home/HolidaySearch';
import hero1 from '@/assets/hero/hero-1.jpg';
import hero2 from '@/assets/hero/hero-2.jpg';
import hero3 from '@/assets/hero/hero-3.jpg';
import hero4 from '@/assets/hero/hero-4.jpg';
import hero5 from '@/assets/hero/hero-5.jpg';
import hero6 from '@/assets/hero/hero-6.jpg';
import hero7 from '@/assets/hero/hero-7.jpg';

const SLIDES = [
  { src: hero1, alt: 'Mother and daughter on the Durban beachfront promenade' },
  { src: hero2, alt: 'Family enjoying a boat cruise on a South African dam' },
  { src: hero3, alt: 'Mother and son watching elephants from a bushveld lookout' },
  { src: hero4, alt: 'Family playing in a resort wave pool' },
  { src: hero5, alt: 'Mother and daughter walking at a coastal lookout' },
  { src: hero6, alt: 'Family riding a cable car above the city' },
  { src: hero7, alt: 'Family enjoying a sunset picnic beside a lake' },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[620px] w-full md:min-h-[660px]">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1600}
            height={1000}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/10" />

        <div className="container relative mx-auto flex min-h-[620px] flex-col justify-center px-4 py-20 md:min-h-[660px]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              South African holidays, beautifully arranged
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              Choose where you want to go. We've done the rest.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
              Pick a destination, choose your experience, choose where you stay — and see your complete
              holiday price before you book.
            </p>
          </div>

          <HolidaySearch className="mt-10 w-full max-w-5xl" />

          <div className="mt-6 flex gap-2">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-8 bg-gold' : 'w-4 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
