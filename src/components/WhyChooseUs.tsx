import { Percent, Headphones, MapPin, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Percent,
    title: 'Best Prices Guaranteed',
    description: 'We offer the most competitive prices for quality travel experiences with regular discounts and special offers.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Headphones,
    title: 'Personalized Service',
    description: 'Our team provides dedicated support to ensure your travel experience is seamless and memorable.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: MapPin,
    title: 'Curated Experiences',
    description: 'We carefully select each activity and accommodation to provide authentic and unforgettable experiences.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your safety is our priority. All our partners are vetted and we ensure secure booking processes.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Clock,
    title: 'Instant Quotes',
    description: 'Get accurate pricing in seconds with our automated quote system. No more waiting for responses!',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We\'re travelers ourselves and we put our hearts into creating packages you\'ll love.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose Travel Affordable
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to making your dream vacation a reality with unbeatable value and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card shadow-soft hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
