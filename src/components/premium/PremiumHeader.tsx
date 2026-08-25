import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plane, X } from 'lucide-react';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Destinations', to: '/#destinations' },
  { label: 'Getaways', to: '/#destinations' },
  { label: 'Deals', to: '/#deals' },
  { label: 'About Us', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

interface PremiumHeaderProps {
  /** Transparent over a dark hero (homepage / destination hero). */
  overlay?: boolean;
}

export function PremiumHeader({ overlay = false }: PremiumHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = !overlay || scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid ? 'bg-burgundy-dark/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/55 to-transparent',
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-[72px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Travel Affordable home">
            <span className="font-display text-2xl font-bold leading-none tracking-wide text-white">
              Travel
              <span className="block text-[0.55rem] font-sans font-semibold uppercase tracking-[0.35em] text-champagne">
                Affordable
              </span>
            </span>
            <Plane className="h-4 w-4 -rotate-12 text-champagne" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-white/85 transition-colors hover:text-champagne"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/27796813869"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[0.8rem] font-medium uppercase tracking-[0.12em] text-champagne md:block"
            >
              079 681 3869
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-white/10 bg-burgundy-dark/98 backdrop-blur-md">
          <div className="container mx-auto grid gap-1 px-4 py-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-champagne">
              Popular destinations
            </p>
            <div className="grid grid-cols-2 gap-1">
              {catalogueDestinations.slice(0, 10).map((d) => (
                <Link
                  key={d.slug}
                  to={`/destinations/${d.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/10"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
