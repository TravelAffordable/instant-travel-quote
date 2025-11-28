import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: "Our Harties getaway was absolutely perfect! The sunset cruise was breathtaking and the accommodation was cozy. Will definitely book with Travel Affordable again!",
    destination: 'Hartbeespoort',
  },
  {
    id: 2,
    name: 'James T.',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    text: "The Sun City package was worth every penny. Valley of Waves was amazing and the service from Travel Affordable was exceptional. Highly recommended!",
    destination: 'Sun City',
  },
  {
    id: 3,
    name: 'Jennifer J.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.5,
    text: "Our romantic Umhlanga package was everything we hoped for. The beachfront accommodation and the gondola cruise made our anniversary special. Thank you!",
    destination: 'Umhlanga',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy travelers who've experienced unforgettable getaways with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="border-0 shadow-soft bg-card relative">
              <CardContent className="p-6">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.destination}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(testimonial.rating)
                          ? 'text-secondary fill-secondary'
                          : i < testimonial.rating
                          ? 'text-secondary fill-secondary/50'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
