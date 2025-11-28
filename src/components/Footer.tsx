import { Plane, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold text-primary-foreground mb-3">
              Get Exclusive Travel Deals
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to our newsletter and be the first to know about special offers and new destinations.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-primary-foreground text-foreground border-0 h-12"
              />
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 px-6 font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Travel Affordable</h4>
                </div>
              </div>
              <p className="text-background/70 text-sm leading-relaxed mb-4">
                Making dream vacations accessible to everyone. We specialize in affordable travel packages across South Africa and international destinations.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#destinations" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Popular Destinations
                  </a>
                </li>
                <li>
                  <a href="#quote" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Get a Quote
                  </a>
                </li>
                <li>
                  <a href="#group-tours" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Group Tours
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Top Destinations</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Cape Town
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Sun City
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Durban
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Bali, Indonesia
                  </a>
                </li>
                <li>
                  <a href="#" className="text-background/70 hover:text-primary text-sm transition-colors">
                    Dubai, UAE
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <a href="mailto:info@travelaffordable.co.za" className="text-background/70 hover:text-primary text-sm transition-colors block">
                      info@travelaffordable.co.za
                    </a>
                    <a href="mailto:travelaffordable2017@gmail.com" className="text-background/70 hover:text-primary text-sm transition-colors block">
                      travelaffordable2017@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="https://wa.me/27796813869" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary text-sm transition-colors">
                    079 681 3869 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-background/70 text-sm">
                    Johannesburg, South Africa
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} Travel Affordable. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-background/60 hover:text-primary text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/60 hover:text-primary text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
