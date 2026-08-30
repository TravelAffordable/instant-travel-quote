import hero1 from '@/assets/hero/hero-1.jpg';

/** Static hero (no rotating images) matching the approved homepage design. */
export function HeroStatic() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[560px] w-full md:min-h-[620px]">
        <img
          src={hero1}
          alt="Mother and daughter on the Durban beachfront promenade"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/10" />

        <div className="container relative mx-auto flex min-h-[560px] flex-col justify-center px-4 py-20 md:min-h-[620px]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              South African holidays, beautifully arranged
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              Choose where to go. We'll do the rest.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
              Pick a destination, choose your experience, choose where you stay — and see your complete
              holiday price before you book.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
