import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Plane, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { catalogueDestinations } from '@/data/destinationCatalogue';

const navItems = [
  { label: 'Experiences', to: '/#experiences' },
  { label: 'Deals', to: '/#deals' },
  { label: 'Family Travel', to: '/' },
  { label: 'Couples', to: '/' },
  { label: 'About Us', to: '/#why-choose-us' },
  { label: 'Contact', to: '/#contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">Travel Affordable</span>
              <p className="-mt-0.5 text-[10px] text-muted-foreground">Your journey. Our passion.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                Destinations
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
                {catalogueDestinations.map((d) => (
                  <DropdownMenuItem key={d.slug} asChild>
                    <Link to={`/destinations/${d.slug}`}>
                      {d.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://wa.me/27796813869"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              079 681 3869
            </a>
            <Button asChild className="font-semibold">
              <Link to="/">Plan my holiday</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="animate-fade-in border-t border-border/50 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                to="/#destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-foreground/80 hover:bg-muted"
              >
                Destinations
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-foreground/80 hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Plan my holiday
                </Link>
              </Button>
              <a
                href="https://wa.me/27796813869"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 font-medium text-accent"
              >
                <Phone className="h-4 w-4" />
                079 681 3869
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
