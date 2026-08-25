import { GetawaySearch } from '@/components/premium/GetawaySearch';
import hero1 from '@/assets/hero/hero-1.jpg';

export function PremiumHero() {
  return (
    <section className="relative">
      <div className="relative min-h-[640px] w-full md:min-h-[720px]">
        <img
          src={hero1}
          alt="Mother and daughter enjoying a South African beach getaway"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark/92 via-burgundy-dark/60 to-burgundy-dark/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />

        <div className="container relative mx-auto flex min-h-[640px] flex-col justify-center px-4 pb-24 pt-32 md:min-h-[720px] md:pt-36">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-champagne">
            Memories that matter.
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Getaways that
            <span className="block text-champagne">fit your life.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Beautiful destinations. Amazing experiences. Handpicked stays.
            <br className="hidden sm:block" /> All at a price that makes sense.
          </p>

          <GetawaySearch className="mt-10 w-full max-w-5xl" />
        </div>
      </div>
    </section>
  );
}
